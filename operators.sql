-- Copyright (©) 2011  Andrzej Zaborowski
--
-- This program is free software; you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License version 3
-- as published by the Free Software Foundation.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with this program; if not, see <http://www.gnu.org/licenses/>.

--
-- Helper functions
--
-- TODO: try using recursive CTEs for graph searching everywhere
CREATE OR REPLACE FUNCTION helper_forest_dominance(parent integer[][],
	child integer, maxdepth integer, chfrom integer, chto integer)
RETURNS bool AS $$
BEGIN
  -- TODO: optimise to never look in the same subtrees multiple times!
  --return 0 < (SELECT COUNT(*) FROM node AS n
  --    WHERE forest_direct_dominance(parent, n)
  --    AND (id = child OR helper_forest_dominance(children, child)) LIMIT 1);
  return EXISTS (SELECT 1 FROM node WHERE id = ANY(parent) AND
      frompos <= chfrom AND topos >= chto AND depth <= maxdepth AND
      (id = child OR helper_forest_dominance(children,
        child, maxdepth, chfrom, chto)));
  --return 0 < (SELECT COUNT(*) FROM node WHERE child = ANY(children) AND
  --    depth >= mindepth AND (id = parent OR
  --    helper_forest_dominance(parent, id, mindepth)) LIMIT 1);
END;
$$ LANGUAGE plpgsql;

--
-- Implementations of TIGERSearch relations, functions are use by the
-- converted TIGERSearch queries
--
CREATE OR REPLACE FUNCTION left_corner(parent node, child node)
RETURNS bool AS $$
BEGIN
  return p.frompos = c.frompos AND c.terminal;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION forest_left_corner(parent node, child node)
RETURNS bool COST 1000000000000000000000000000000000000000 AS $$
BEGIN
  return p.frompos = c.frompos AND c.terminal AND
      forest_dominance(parent, child);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION right_corner(parent node, child node)
RETURNS bool AS $$
BEGIN
  return p.topos = c.topos AND c.terminal;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION forest_right_corner(parent node, child node)
RETURNS bool COST 1000000000000000000000000000000000000000 AS $$
BEGIN
  return p.topos = c.topos AND c.terminal AND forest_dominance(parent, child);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION central_corner(parent node, child node)
RETURNS bool COST 1000000 AS $$
BEGIN
  -- TODO
  return false;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION forest_central_corner(parent node, child node)
RETURNS bool COST 1000000 AS $$
BEGIN
  -- TODO
  return false;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION dominance(parent node, child node)
RETURNS bool AS $$
BEGIN
  return parent.depth < child.depth AND parent.frompos <= child.frompos AND
      parent.topos >= child.topos;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION forest_dominance(parent node, child node)
RETURNS bool COST 1000000000000000000000000000000000000000 AS $$
BEGIN
  return dominance(parent, child) AND helper_forest_dominance(parent.children,
      child.id, child.depth, child.frompos, child.topos);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION direct_dominance(parent node, child node)
RETURNS bool COST 10000000000000000 AS $$
BEGIN
  return child.id = ANY(parent.children);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION forest_direct_dominance(parent node, child node)
RETURNS bool COST 10000000000000000 AS $$
BEGIN
  return child.id = ANY(parent.children);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION dominance_num(min integer, max integer,
	parent node, child node)
RETURNS bool COST 1000000000000000000000000000000000000000 AS $$
BEGIN
  -- TODO: this is generally incorrect, use graph search like forest_dominance
  return dominance(parent, child) AND child.depth - parent.depth >= min AND
      child.depth - parent.depth <= max;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION forest_dominance_num(min integer, max integer,
	parent node, child node)
RETURNS bool COST 1000000000000000000000000000000000000000 AS $$
BEGIN
  -- TODO: this is generally incorrect, use graph search like forest_dominance
  -- does
  return child.depth - parent.depth >= min AND
      child.depth - parent.depth <= max AND forest_dominance(parent, child);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION labelled_direct_dominance(rule varchar(8),
	parent node, child node)
RETURNS bool COST 1000000000000000000000 AS $$
BEGIN
  -- Could also be done as (better?)
  -- return direct_dominance(parent, child) (for speed only) AND EXISTS
  --   (SELECT 1 FROM generate_series(1, array_upper(parent.children, 1)) AS i
  --      WHERE rule = parent.rules[i] AND
  --         child.id = ANY(parent.children[i][1:40]));
  FOR i IN array_lower(parent.children, 1)..array_upper(parent.children, 1) LOOP
    IF rule = parent.rules[i] AND child.id = ANY(parent.children[i:i]) THEN
      return true;
    END IF;
  END LOOP;
  return false;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION forest_labelled_direct_dominance(rule varchar(8),
	parent node, child node)
RETURNS bool COST 10000000000000000000000 AS $$
BEGIN
  FOR i IN array_lower(parent.children, 1)..array_upper(parent.children, 1) LOOP
    IF rule = parent.rules[i] AND child.id = ANY(parent.children[i:i]) THEN
      return true;
    END IF;
  END LOOP;
  return false;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION precedence(left node, right node)
RETURNS bool AS $$
BEGIN
  return left.frompos < right.frompos;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION direct_precedence(left node, right node)
RETURNS bool AS $$
BEGIN
  return left.topos = right.frompos;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION precedence_num(min integer, max integer,
	left node, right node)
RETURNS bool AS $$
BEGIN
  return right.frompos - left.frompos >= min AND
      right.frompos - left.frompos <= max;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION siblings_with_precedence(left node, right node)
RETURNS bool COST 1000000000000000000000000000 AS $$
BEGIN
  return left.frompos < right.frompos and siblings(left, right);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION forest_siblings_with_precedence(left node,
	right node)
RETURNS bool COST 1000000000000000000000000000 AS $$
BEGIN
  return left.frompos < right.frompos and forest_siblings(left, right);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION siblings(left node, right node)
RETURNS bool COST 1000000000000000000000000000 AS $$
BEGIN
  return EXISTS (SELECT 1 FROM node WHERE treeid = left.treeid AND
      sel AND left.id = ANY(children) AND right.id = ANY(children));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION forest_siblings(left node, right node)
RETURNS bool COST 1000000000000000000000000000 AS $$
BEGIN
  return EXISTS (SELECT 1 FROM node WHERE treeid = left.treeid AND
      left.id = ANY(children) AND right.id = ANY(children));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION same(a node, b node)
RETURNS bool AS $$
BEGIN
  return a.category = b.category AND a.base = b.base AND a.orth = b.orth AND
      a.f = b.f;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION root(n node)
RETURNS bool COST 1000000000000000000000000000 AS $$
BEGIN
  return NOT EXISTS (SELECT 1 FROM node WHERE n.id = ANY(children));
END;
$$ LANGUAGE plpgsql;

-- Would somehow returning all of the matching nodes improve pgsql's planning?
CREATE OR REPLACE FUNCTION same_tree(a node, b node)
RETURNS bool COST 1000000000000000000000000000000000000 AS $$
DECLARE
  a_parents int[]; -- node.id%TYPE[];
  new_parents int[]; -- node.id%TYPE[];
  prev_a_parents int[]; -- node.id%TYPE[];
  prev_b_parents int[]; -- node.id%TYPE[];
BEGIN
  IF a.frompos = b.frompos AND a.topos = b.topos THEN
    new_parents := ARRAY[a.id];
    LOOP
      IF b.id = ANY(new_parents) THEN
        return true;
      END IF;
      SELECT INTO new_parents array_agg(id) FROM node
        WHERE treeid = a.treeid AND frompos = a.frompos AND topos = a.topos AND
          children && new_parents;
      EXIT WHEN new_parents IS NULL;
    END LOOP;
    new_parents := ARRAY[b.id];
    LOOP
      IF a.id = ANY(new_parents) THEN
        return true;
      END IF;
      SELECT INTO new_parents array_agg(id) FROM node
        WHERE treeid = a.treeid AND frompos = a.frompos AND topos = a.topos AND
          children && new_parents;
      EXIT WHEN new_parents IS NULL;
    END LOOP;
    return false;
  END IF;
  SELECT INTO prev_a_parents array_agg(a.children[i][1])
    FROM generate_series(1, array_upper(a.children, 1)) AS i;
  new_parents := ARRAY[a.id];
  a_parents := ARRAY[]::int[];
  LOOP
    -- Note: we could further optimise by stopping the search in the branches
    -- that partially overlap b
    SELECT INTO a_parents array_agg(id) || ARRAY[]::int[] FROM (
        SELECT unnest(a_parents) AS id
        UNION
        SELECT id FROM node WHERE id = ANY(new_parents) AND
          frompos <= b.frompos AND topos >= b.topos) AS id;
    -- Is this faster than the commented version below?
    SELECT INTO new_parents array_agg(id) FROM unnest(new_parents) AS id
      WHERE id <> ALL(a_parents);
    --SELECT INTO new_parents array_agg(id) FROM node
    -- WHERE id = ANY(new_parents) AND (frompos > a.frompos OR topos < a.topos);
    prev_a_parents := prev_a_parents || new_parents;
    SELECT INTO new_parents array_agg(id) FROM node
      WHERE treeid = a.treeid AND children && new_parents;
    EXIT WHEN new_parents IS NULL;
  END LOOP;
  SELECT INTO prev_b_parents array_agg(b.children[i][1])
    FROM generate_series(1, array_upper(b.children, 1)) AS i;
  new_parents := ARRAY[b.id];
  LOOP
    -- Would using a FOR that would perform all the 2 or 3 selects below with
    -- just one be faster?
    IF EXISTS (SELECT 1 FROM node WHERE id = ANY(new_parents) AND
        frompos <= a.frompos AND topos >= a.topos AND id = ANY(a_parents) AND
        EXISTS (SELECT 1 FROM generate_series(1, array_upper(children, 1)) AS i
          WHERE children[i:i] && prev_a_parents AND
            children[i:i] && prev_b_parents)) THEN
      return true;
    END IF;
    SELECT INTO prev_b_parents array_agg(id) FROM node
      WHERE id = ANY(new_parents) AND (frompos > a.frompos OR topos < a.topos);
    SELECT INTO new_parents array_agg(id) FROM node
      WHERE treeid = a.treeid AND children && prev_b_parents;
    EXIT WHEN new_parents IS NULL;
  END LOOP;
  return false;
END;
$$ LANGUAGE plpgsql;
