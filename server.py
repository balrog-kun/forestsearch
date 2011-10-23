#! /usr/bin/python3
#
# Copyright (©) 2011  Andrzej Zaborowski
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License version 3 as
# published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
#
# NOTE: do not run this on computers on untrusted networks -- input may
# need to be validated in a couple of places.
#
import http.server
import os
import urllib.parse
import socketserver
import sys
import tigerquery

class SearchHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
	def setup(self):
		http.server.SimpleHTTPRequestHandler.setup(self)

	def finish(self):
		http.server.SimpleHTTPRequestHandler.finish(self)
		self.server.close_request(self.request);

	def respond(self, answer):
		answer = answer.encode("utf8")
		self.send_response(200)
		self.send_header("Content-type", "text/javascript")
		self.send_header("Content-Length", len(answer))
		self.end_headers()
		self.wfile.write(answer)

	def do_GET(self):
		"""Serve a GET request."""
		path = self.translate_path(self.path)
		req = urllib.parse.unquote(self.path)
		if req.startswith('/search'):
			answer = None
			try:
				answer = self.search(req)
			except Exception as e:
				self.send_error(500, str(e))
				return
			if answer:
				self.respond(answer)
			else:
				self.send_error(404, "File not found")
			return

		f = self.send_head()
		if f:
			self.copyfile(f, self.wfile)
			f.close()

	def search(self, req):
		offset = 0
		if req.startswith('/search/'):
			tiger = req[8:]
		elif req.startswith('/searchat/'):
			offset, tiger = req[10:].split('/', 1)
			offset = int(offset)
		elif req.startswith('/searchcount/'):
			tiger = req[13:]
			try:
				self.log_message('counting ' + tiger)
				resp, sql = tigerquery.count(tiger)
				return 'var ret = { count: ' + str(resp) + \
					', sql: ' + to_jstr(sql) + ' }'
			except Exception as e:
				return 'var ret = ' + to_jstr(str(e))
		else:
			raise Exception('Unknown request')
		try:
			self.log_message('executing ' + tiger)
			resp, sql = tigerquery.query(tiger, offset)
			return 'var ret = { hits: [' + \
				','.join([ '\n  { path: \'' + x[0] + \
					'\', nodes: [ ' + \
					', '.join([ repr(list(y)) for y \
						in zip(*x[1:]) ]) + \
					' ] }' for x in resp ]) + \
				'\n], sql: ' + to_jstr(sql) + ' }'
		except Exception as e:
			return 'var ret = ' + to_jstr(str(e))

	def send_head(self):
		"""Common code for GET and HEAD commands.

		This sends the response code and MIME headers.

		Return value is either a file object (which has to be copied
		to the outputfile by the caller unless the command was HEAD,
		and must be closed by the caller under all circumstances), or
		None, in which case the caller has nothing further to do.

		"""
		path = self.translate_path(self.path)
		f = None
		if os.path.isdir(path):
			if not self.path.endswith('/'):
				# redirect browser -
				# doing basically what apache does
				self.send_response(301)
				self.send_header("Location", self.path + "/")
				self.end_headers()
				return None
			for index in "index.html", "index.htm", "index.xhtml":
				index = os.path.join(path, index)
				if os.path.exists(index):
					path = index
					break
			else:
				return self.list_directory(path)
		ctype = self.guess_type(path)
		try:
			f = open(path, 'rb')
		except IOError:
			self.send_error(404, "File not found")
			return None
		self.send_response(200)
		self.send_header("Content-type", ctype)
		fs = os.fstat(f.fileno())
		self.send_header("Content-Length", str(fs[6]))
		self.send_header("Last-Modified",
				self.date_time_string(fs.st_mtime))
		self.end_headers()
		return f

def to_jstr(s):
	return '\'' + s.replace('\'', '\\\'').replace('\n', '\\\n') + '\'';

class SearchHTTPServer(http.server.HTTPServer):
	def __init__(self, server_address,
			RequestHandlerClass=SearchHTTPRequestHandler,
			server_version="SearchServer/0.1"):
		http.server.HTTPServer.__init__(self,
				server_address, RequestHandlerClass)
		self.server_version = server_version

	def process_request(self, request, client_address):
		"""
		Normally self.close_request() would be called here at the
		end, but we override this method to only do finish_request().
		The RequestHandler needs to call close_request when it's
		done.
		"""
		self.finish_request(request, client_address)

httpd = SearchHTTPServer(('', 8000))

try:
	while 1:
		httpd.handle_request()
except KeyboardInterrupt:
	httpd.server_close()
