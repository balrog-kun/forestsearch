#! /usr/bin/python3
# Translates TIGERSearch queries into SQL (postgres flavour)
#
# Copyright (C) 2011  Andrzej Zaborowski
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License version 3
# as published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program; if not, see <http://www.gnu.org/licenses/>.

# TIGERSearch query language lexer

tokens = (
	'STRING', 'RE', 'ID', 'DOMINANCE', 'PRECEDENCE', 'SIBLING',
	'OR', 'AND', 'EQ', 'NOT',
	'LPAREN', 'RPAREN', 'DLBRACKET', 'DRBRACKET', 'LBRACKET', 'RBRACKET',
	'COMMA',
	'VARDECL', 'VAR'
)

# NOTE! the string contents for STRING or RE are not checked yet, SQL
# injection may be very easy to execute if the input is unchecked!

def t_STRING(t):
	r'"(?:(?:\\[^\'])|[^\"])*"'
	t.value = '\'' + t.value[1:-1].replace('\'', '\\\'') + '\''
	return t
t_ID = r'[-\w$]+'
def t_RE(t):
	r'/(?:(?:\\.)|[^\/])*/'
	t.value = t.value[1:-1]
	return t
t_DOMINANCE = r'!?>(?:(?:@[lcr])|\*|(?:[0-9]+,[0-9]+)|[0-9]+|\w*)'
t_PRECEDENCE = r'!?\.(?:\*|(?:[0-9]+,[0-9]+)|[0-9]+|)'
t_SIBLING = r'!?\$(?:\.\*)?'
t_OR = r'\|'
t_AND = r'&'
t_EQ = r'='
t_NOT = r'!'
t_LPAREN = r'\('
t_RPAREN = r'\)'
t_DLBRACKET = r'\[\['
t_DRBRACKET = r']]'
t_LBRACKET = r'\['
t_RBRACKET = r']'
t_COMMA = r','
t_VAR = r'\#[-\w$]+'
def t_VARDECL(t):
	r'\#[-\w$]+:'
	t.value = t.value[:-1]
	return t

t_ignore_WHITESPACE = r'\s+'

def t_error(t):
	raise Exception('unrecognised token at \'' + t.value + '\'')

import ply.lex as lex
lex.lex()

# TIGERSearch query language parser helper function

nodenum = 0
nodenames = []
def get_next_node():
	global nodenum, nodenames
	nodename = 'n' + str(nodenum)
	nodenum += 1
	nodenames.append(nodename)
	return nodename

def check_dupes(a, b):
	common = [ v for v in a if v in b ]
	if common:
		raise Exception('Variables ' + str(common) + ' redefined')
	ret = a.copy()
	ret.update(b)
	return ret

def get_rel(oper, general, a, b):
	name = ''
	query = ''
	if oper[0] == '!':
		#name += 'negated_'
		query += 'NOT ' ###
		oper = oper[1:]
	if oper[0] == '>':
		oper = oper[1:]
		if general:
			name += 'forest_'
		if oper == '@l':
			name += 'left_corner('
		elif oper == '@c':
			name += 'central_corner('
		elif oper == '@r':
			name += 'right_corner('
		elif oper == '*':
			name += 'dominance('
		elif oper == '':
			name += 'direct_dominance('
			query += b + '.id = ANY(' + a + '.children)'
		elif oper[0].isdigit() and ',' in oper:
			a, b = oper.split(',')
			name += 'dominance_num(' + a + ', ' + b + ', '
		elif oper[0].isdigit():
			name += 'dominance_num(' + oper + ', ' + oper + ', '
		else:
			name += 'labelled_direct_dominance(\'' + oper + '\', '
			# for speed:
			query += '(' + b + '.id = ANY(' + a + '.children) '
			query += 'AND '
			# for speed:
			query += '\'' + oper + '\' = ANY(' + a + '.rules) '
			query += 'AND '
			query += 'EXISTS (SELECT 1 '
			query += 'FROM generate_series(1, array_upper('
			query += a + '.children, 1)) AS i '
			query += 'WHERE ' + a + '.rules[i] = \'' + oper + '\' '
			query += 'AND '
			query += b + '.id = ANY(' + a + '.children[i:i])))'
	elif oper[0] == '.':
		oper = oper[1:]
		if oper == '*':
			name += 'precedence('
		elif oper == '':
			name += 'direct_precedence('
		elif oper[0].isdigit() and ',' in oper:
			a, b = oper.split(',')
			name += 'precedence_num(' + a + ', ' + b + ', '
		elif oper[0].isdigit():
			name += 'precedence_num(' + oper + ', ' + oper + ', '
	elif oper[0] == '$':
		oper = oper[1:]
		if general:
			name += 'forest_'
		if oper == '.*':
			name += 'siblings_with_precedence('
		elif oper == '':
			name += 'siblings('
	if len(query) > 5:
		return query
	else:
		return name + a + ', ' + b + ')'

# TIGERSearch query language parser

precedence = (
	( 'right', 'NOT', 'VARDECL' ),
	( 'left', 'OR' ),
	( 'left', 'AND' ),
	( 'left', 'EQ' ),
	( 'left', 'DOMINANCE', 'PRECEDENCE', 'SIBLING' )
)

def p_node_query(t):
	'node_query : node_expr'
	vars, where, nodes = t[1]
	for v in vars:
		where = where.replace(v, vars[v]) # FIXME
	if nodes:
		for i, j in zip(nodes, nodes[1:]):
			where = i + '.treeid = ' + j + '.treeid AND ' + where
		where += ' AND ' + nodes[0] + '.treeid = tree.id'

	t[0] = ( where, nodes )

def p_node_expr_simple(t):
	'node_expr : node_rel'
	t[0] = t[1]
def p_node_expr_group(t):
	'node_expr : LPAREN node_expr RPAREN'
	t[0] = t[2]
def p_node_expr_oper(t):
	'''node_expr : node_expr AND node_expr
	             | node_expr OR node_expr'''
	oper = 'AND' if t[2] == '&' else 'OR'
	t[0] = ( check_dupes(t[1][0], t[3][0]),
		'(' + t[1][1] + ') ' + oper + ' (' + t[3][1] + ')',
		t[1][2] + t[3][2] )

def p_node_rel_dummy(t):
	'node_rel : node_infix_rel'
	t[0] = ( t[1][0], t[1][1], t[1][4] )
def p_node_rel_nary(t):
	'node_rel : ID LPAREN node_desc_list RPAREN'
	# Apparently inlining the relation implementations makes the
	# postgresql planner better optimise queries than when using
	# pl/pgsql functions because it doesn't look inside the functions.
	# So we inline them here when possible.  We should do the same
	# thing above in get_rel()
	if t[1] == 'root' and len(t[3]) == 1:
		vars = t[3][0][0]
		# HACK (could also compare the nid.. which would also be a HACK)
		wheres = t[3][0][2] + '.category = \'wypowiedzenie\' AND ' + \
				'(' + t[3][0][1] + ')'
	elif t[1] == 'same_tree' and len(t[3]) == 2:
		vars = check_dupes(t[3][0][0], t[3][1][0])
		wheres = '(' + t[3][0][1] + ') AND (' + t[3][1][1] + \
				') AND same_tree(' + t[3][0][2] + ', ' + \
				t[3][1][2] + ')'
	else:
		raise Exception('Unknown relation: ' + t[1] + '/' +
				str(len(t[3])))
	t[0] = ( vars, wheres, [ n for tt in t[3] for n in tt[4] ] )

def p_node_infix_rel_dummy(t):
	'node_infix_rel : node_desc'
	t[0] = t[1]
def p_node_rel_infix_binary(t):
	'''node_infix_rel : node_infix_rel DOMINANCE node_desc
	                  | node_infix_rel PRECEDENCE node_desc
	                  | node_infix_rel SIBLING node_desc'''
	t[0] = ( check_dupes(t[1][0], t[3][0]),
		'(' + t[1][1] + ') AND (' + t[3][1] + ') AND ' +
		get_rel(t[2], t[1][3] or t[3][3], t[1][2], t[3][2]),
		t[3][2], t[3][3], t[1][4] + t[2][4] )

def p_node_desc_list(t):
	'''node_desc_list : node_desc
	                  | node_desc_list COMMA node_desc'''
	t[0] = (t[1] if len(t) > 2 else []) + [ t[len(t) - 1] ]

def p_node_desc(t):
	'''node_desc : LBRACKET feat_constraint RBRACKET
		     | DLBRACKET feat_constraint DRBRACKET
	             | VARDECL LBRACKET feat_constraint RBRACKET
	             | VARDECL DLBRACKET feat_constraint DRBRACKET'''
	nodename = get_next_node()

	where = t[len(t) - 2][2].replace('####nodename', nodename)
	if t[len(t) - 1] == ']':
		where = nodename + '.sel AND (' + where + ')'

	vars0 = { v: nodename for v in t[1:-3] }
	vars1 = { v: nodename for v in t[len(t) - 2][0] }
	vars2 = { v: nodename + '.' + t[len(t) - 2][1][v] for
			v in t[len(t) - 2][1] }

	t[0] = ( check_dupes(check_dupes(vars0, vars1), vars2),
		where, nodename, t[len(t) - 1] != ']', [ nodename ] )
def p_node_desc_var(t):
	'node_desc : VAR'
	t[0] = ( {}, 'true', t[1], False, [] )
	# REVISIT: why False? should be True?

def p_feat_constraint_empty(t):
	'feat_constraint : '
	t[0] = ( [], {}, 'true' )
def p_feat_constraint_expr(t):
	'''feat_constraint : feat_expr
	                   | VARDECL feat_expr'''
	t[0] = ( t[1:-1], t[len(t) - 1][0], t[len(t) - 1][1] )
def p_feat_constraint_var(t):
	'feat_constraint : VAR'
	t[0] = ( [], {}, 'same(####nodename, ' + t[1] )

def p_feat_expr_not(t):
	'feat_expr : NOT feat_expr'
	t[0] = ( t[2][0], 'NOT (' + t[2][1] + ')' )
def p_feat_expr_and(t):
	'''feat_expr : feat_expr AND feat_expr
	             | feat_expr OR feat_expr'''
	oper = 'AND' if t[2] == '&' else 'OR'
	t[0] = ( check_dupes(t[1][0], t[3][0]),
		'(' + t[1][1] + ') ' + oper + ' (' + t[3][1] + ')' )
def p_feat_expr_group(t):
	'feat_expr : LPAREN feat_expr RPAREN'
	t[0] = t[2]
def p_feat_expr_val(t):
	'feat_expr : feat_val'
	t[0] = t[1]

def p_feat_val_simple(t):
	'''feat_val : ID EQ feat_val_right
	            | ID NOT EQ feat_val_right'''
	if t[1] in [ 'orth', 'base', 'category' ]:
		featname = t[1]
	elif t[1] in [ 'id', 'treeid', 'depth', 'terminal', 'sel', 'f',
			'children', 'rules' ]:
		featname = t[1] + '::text'
	elif t[1] in [ 'frompos', 'topos' ]:
		featname = t[1][:-3] + '::text'
	elif t[1] in [ 'nid' ]:
		featname = 'id::text'
	else:
		featname = 'f::hstore->\'' + t[1] + '\''
	vars = { v: featname for v in t[len(t) - 1][0] }
	where = t[len(t) - 1][1].replace('####featname',
			'####nodename.' + featname)
	if len(t) > 4:
		where = 'NOT (' + where + ')'
	t[0] = ( vars, where )

def p_feat_val_hstore(t):
	'''feat_val : ID PRECEDENCE ID EQ feat_val_right
	            | ID PRECEDENCE ID NOT EQ feat_val_right'''
	featname = t[1] + '::hstore->\'' + t[3] + '\''
	vars = { v: featname for v in t[len(t) - 1][0] }
	where = t[len(t) - 1][1].replace('####featname',
			'####nodename.' + featname)
	if len(t) > 6:
		where = 'NOT (' + where + ')'
	t[0] = ( vars, where )

def p_feat_val_right(t):
	'''feat_val_right : feat_val_expr
	                  | VARDECL feat_val_expr'''
	t[0] = ( t[1:-1], t[len(t) - 1] )

def p_feat_val_expr_string(t):
	'''feat_val_expr : STRING
	                 | VAR'''
	t[0] = '####featname = ' + t[1]
def p_feat_val_expr_re(t):
	'feat_val_expr : RE'
	re = t[1].replace('\\', '\\\\').replace('\'', '\\\'')
	if re[0] != '^':
		re = '^' + re
	if re[-1] != '$':
		re = re + '$'
	t[0] = '####featname ~ \'' + re + '\''
def p_feat_val_expr_not(t):
	'feat_val_expr : NOT feat_val_expr'
	t[0] = 'NOT (' + t[2] + ')'
def p_feat_val_expr_group(t):
	'feat_val_expr : LPAREN feat_val_expr_paren RPAREN'''
	t[0] = t[2]

def p_feat_val_expr_paren_simple(t):
	'feat_val_expr_paren : feat_val_expr'
	t[0] = t[1]
def p_feat_val_expr_paren_and(t):
	'''feat_val_expr_paren : feat_val_expr_paren AND feat_val_expr_paren
	                       | feat_val_expr_paren OR feat_val_expr_paren'''
	oper = 'AND' if t[2] == '&' else 'OR'
	t[0] = '(' + t[1] + ') ' + oper + ' (' + t[3] + ')'

def p_error(t):
	raise Exception('syntax error')

import ply.yacc as yacc
yacc.yacc()

import psycopg2
conn = psycopg2.connect('dbname=treebank')
conn.autocommit = True

curs = conn.cursor()
curs.execute('SET statement_timeout TO 20000')

def query(tiger, offset):
	global nodenum, nodenames
	nodenum = 0
	nodenames = []
	where, nodes = yacc.parse(tiger)
	if '#' in where:
		raise Exception('found uses of undefined variables')

	sql = 'SELECT filename, ' + \
		', '.join([ 'array_agg(' + i + '.id - nid)' \
			for i in nodes ]) + \
		' FROM ' + ', '.join([ 'node as ' + i for i in nodes ] +
				[ 'tree' ]) + \
		' WHERE ' + where + \
		' GROUP BY filename' + \
		' OFFSET ' + str(offset) + \
		' LIMIT 20'

	curs.execute(sql)
	return curs.fetchall(), sql

def count(tiger):
	global nodenum, nodenames
	nodenum = 0
	nodenames = []
	where, nodes = yacc.parse(tiger)
	if '#' in where:
		raise Exception('found uses of undefined variables')

	# TODO: use Loose Indexscan recursive CTEs (as below) but figure
	# out how to force a sensible query plan
	sql = 'WITH RECURSIVE t AS (SELECT -1 AS treeid UNION ALL SELECT (' + \
		'SELECT min(n0.treeid) AS treeid' + \
		' FROM ' + ', '.join([ 'node as ' + i for i in nodes ]) + \
		' WHERE n0.treeid > t.treeid AND ' + where + \
		') FROM t WHERE t.treeid IS NOT NULL)' + \
		' SELECT COUNT(1) - 1 FROM t'
	# For now we use a COUNT DISTINCT, which may be really slow sometimes
	# XXX: selecting from tree could be avoided when no nested queries
	sql = 'SELECT COUNT(DISTINCT tree.id)' + \
		' FROM tree' + ''.join([ ', node as ' + i for i in nodes ]) + \
		' WHERE ' + where

	curs.execute(sql)
	return curs.fetchall()[0][0], sql

if __name__ == '__main__':
	import sys

	if len(sys.argv) < 2:
		sys.stderr.write('Too few arguments\n')
		sys.exit(-1)

	tiger = ' '.join(sys.argv[1:])

	print(query(tiger, 0))
