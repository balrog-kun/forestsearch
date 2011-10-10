#! /usr/bin/python3

import sys
import os
import psycopg2
import xml.etree.cElementTree as etree

searchpath = '.'
if len(sys.argv) > 1:
	searchpath = sys.argv[1]

conn = psycopg2.connect('dbname=treebank')
curs = conn.cursor()
curs.execute('DROP TABLE IF EXISTS tree CASCADE')
curs.execute('CREATE TABLE tree ( ' +
		'id int PRIMARY KEY, ' +
		'filename text NOT NULL, ' +
		'nid int NOT NULL ' +
		')')
curs.execute('DROP TABLE IF EXISTS node CASCADE')
curs.execute('CREATE TABLE node ( ' +
		'id int PRIMARY KEY, ' +
		'frompos int NOT NULL, ' +
		'topos int NOT NULL, ' +
		'treeid int references tree(id), ' +
		'depth int NOT NULL, ' +
		'terminal bool NOT NULL, ' +
		'sel bool NOT NULL, ' +
		'orth text NULL, ' +
		'base text NULL, ' +
		'f hstore NOT NULL, ' +
		'children int[][] NULL, ' +
		'rules varchar(8)[] NULL, ' +
		'category varchar(15) NULL ' + # TODO enum type
		')')

def node_depth_update(graph, depthmap, nid):
	next = depthmap[nid] + 1
	for i in graph[nid]:
		if i not in depthmap or next < depthmap[i]:
			depthmap[i] = next
			node_depth_update(graph, depthmap, i)

def parse_node_desc_update(el, graph, selmap):
	newnid = el.attrib['nid']
	graph[newnid] = []
	if newnid not in selmap or not selmap[newnid]:
		selmap[newnid] = el.attrib['chosen'] == 'true'
	for subel in el:
		if subel.tag != 'children':
			continue
		for subsub in subel:
			if subsub.tag != 'child':
				continue
			graph[newnid].append(subsub.attrib['nid'])
			newsel = ('chosen' in subel.attrib and \
					subel.attrib['chosen'] == 'true' and \
					selmap[newnid]) or \
					(subsub.attrib['nid'] in selmap and \
					selmap[subsub.attrib['nid']])
			selmap[subsub.attrib['nid']] = newsel

def parse_node_desc(el, nid, tree, depthmap, selmap):
	newnid = el.attrib['nid']
	vals = {
		'f': {},
		'id': str(nid + int(newnid)),
		'frompos': el.attrib['from'],
		'topos': el.attrib['to'],
		'treeid' : str(tree),
		'depth': str(depthmap[newnid]),
		'sel': [ 'false', 'true' ][selmap[newnid]]
	}
	children = []
	rules = []
	chlen = 0
	for subel in el:
		if subel.tag == 'children':
			mchlen = len([ x for x in subel if x.tag == 'child' ])
			if mchlen > chlen:
				chlen = mchlen
	for subel in el:
		if subel.tag in [ 'terminal', 'nonterminal' ]:
			if subel.tag == 'terminal':
				vals['terminal'] = 'true'
			else:
				vals['terminal'] = 'false'

			for subsub in subel:
				text = subsub.text or ''

				if subsub.tag in [ 'orth', 'base', 'category' ]:
					vals[subsub.tag] = '\'' + \
						text.replace('\'', '\\\'') + \
						'\''
				elif subsub.tag == 'f':
					vals['f'][subsub.attrib['type']] = \
						'\"' + \
						text.replace('\"', '\\\"') + \
						'\"'
		elif subel.tag == 'children':
			chld = [ str(int(s.attrib['nid']) + nid) for s in
					subel if s.tag == 'child' ]
			while len(chld) < chlen:
				chld.append('-1')
			children.append('{ ' + ', '.join(chld) + ' }')
			rules.append('\"' + subel.attrib['rule'] + '\"')

	if len(children):
		vals['children'] = '\'{ ' + ', '.join(children) + ' }\''
		vals['rules'] = '\'{ ' + ', '.join(rules) + ' }\''
	vals['f'] = '\'' + ', '.join([ k + ' => ' + vals['f'][k]
		for k in vals['f'] ]).replace('\'', '\\\'') + '\''
	return vals

nid = 0
tree = 0
for path, dir, files in os.walk(searchpath):
	for file in files:
		if not file.startswith("morph") or not file.endswith("-s.xml"):
			continue
		fname = path + '/' + file
		print('Importing ' + fname)
		curs.execute('INSERT INTO tree ( id, filename, nid ) VALUES ' +
				'( ' + str(tree) + ', \'' + fname +
				'\', ' + str(nid) + ' )')

		maxnid = 0
		depthmap = { '0': 0 }
		selmap = { '0': 1 }
		graph = {}
		root = etree.parse(fname).getroot()
		for el in root:
			if el.tag != 'node':
				continue
			parse_node_desc_update(el, graph, selmap)
		if '0' in graph:
			node_depth_update(graph, depthmap, '0')
		for el in root:
			if el.tag != 'node':
				continue
			newnid = int(el.attrib['nid'])
			if newnid > maxnid:
				maxnid = newnid

			vals = parse_node_desc(el, nid, tree, depthmap, selmap)

			curs.execute('INSERT INTO node ( ' +
					', '.join(vals.keys()) +
					' ) VALUES ( ' +
					', '.join(vals.values()) +
					' )')
		nid += maxnid + 1
		tree += 1

conn.commit()
print('Changes committed')
# TODO: indexes
curs.execute('ANALYZE node')
curs.execute('ANALYZE tree')
print('Analyzed')
