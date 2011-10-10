/*
 * cat gfjp.dcg gfjp-elem.dcg | iconv --from-code=latin2 \
 *      --to-code=utf8 | grep '^[^%]' > rules.js
 * :%s/\.[ ^I]*$/",/g
 * :%s/^\([^"]*\)[ ^I]*$/&\\n" +/
 * :%s/^/"/
 *
 * Rules are copyright:
 * Copyright (C) 1992 Marek Świdziński
 * Copyright (C) 1997-2006 Marcin Woliński
 * GPLv2
 */
gfjp.rules = [
"zaimpyt(rzecz, P, Rl, 3, co)\n" +
"     --> s(zaim1n),\n" +
"	zaimrzecz(co, P, Rl)",
"zaimpyt(rzecz, P, Rl, 3, kto)\n" +
"     --> s(zaim5n), \n" +
"	zaimrzecz(kto, P, Rl)",
"zaimpyt(przym, P, Rl, _O, _Kl)\n" +
"     --> s(zaim9n), zaimprzym(F, P, Rl), \n" +
"       { rowne(F, ['czyj','jaki','który'])}",
"zaimpyt(przysl, _P, _Rl, _O, _Kl)\n" +
"     --> s(zaim22), zaimprzys(F), \n" +
"       { rowne(F, [dlaczego,'dokąd','gdzie','jak','kiedy','odkąd','skąd'])}",
"zaimwzg(rzecz, P, Rl, 3, co)\n" +
"     --> s(zaim23n),\n" +
"	zaimrzecz(co, P, Rl)",
"zaimwzg(rzecz, P, Rl, 3, kto)\n" +
"     --> s(zaim27n), \n" +
"	zaimrzecz(kto, P, Rl)",
"zaimwzg(rzecz, P, Rl, 3, 'który')\n" +
"     --> s(zaim31n),\n" +
"	zaimprzym(F, P, Rl), % czy raczej tak???\n" +
"       	{ rowne(F, ['jaki','który'])}",
"zaimwzg(przym, P, Rl, _O, _Kl)\n" +
"     --> s(zaim44n), zaimprzym(jaki, P, Rl)",
"zaimno(przym, P, Rl, _O, tk)\n" +
"     --> s(zaim57n), \n" +
"	zaimprzym(taki, P, Rl)",
"zaimno(przysl, _P, _Rl, _O, tk)\n" +
"     --> s(zaim70), zaimprzys(tak)",
"zaimno(rzecz, P, Rl, 3, co)\n" +
"--> s(zaim71), zaimrzecz(coś, P, Rl)",
"zaimno(rzecz, P, Rl, 3, kto)\n" +
"--> s(zaim72), zaimrzecz(ktoś, P, Rl)",
"zaimno(rzecz, P, r(R1,nmo(R2))/L, _O, co)\n" +
"--> s(zaim73), \n" +
"	zaimprzym(ten, P, r(R1,nmo(R2))/L)",
"zaimno(rzecz, P, r(mn(m(zy)),mo)/poj, _O, kto)\n" +
"--> s(zaim73k), \n" +
"	zaimprzym(ten, P, r(mn(m(zy)),mo)/poj)",
"zaimno(przym, P, Rl, _O, _Kl)\n" +
"--> s(zaim73x),\n" +
"	zaimprzym(ten, P, Rl)",
"zaimneg(rzecz, P, Rl, 3, co)\n" +
"--> s(zaim74), zaimrzecz(nic, P, Rl)",
"zaimneg(rzecz, P, Rl, 3, kto)\n" +
"--> s(zaim75), zaimrzecz(nikt, P, Rl)",
"zaimneg(przysl, _P, _Rl, _O, kto)\n" +
"--> s(zaim76n), zaimprzys(nigdy)",
"pyt(F, I) --> s(par1), partykula(F), \n" +
"	spoj(Tsp, I, ni),\n" +
"	{ rowne(I, ['bowiem','natomiast','więc','zaś']),\n" +
"	  rowne(Tsp, [pi,ri]) }",
"pyt(F, ni) --> s(par2), partykula(F)",
"agl(Rl, O, I)  --> s(agl1), agl1(Rl, O), \n" +
"	spoj(Tsp, I, ni),\n" +
"	{ rowne(I, ['bowiem','natomiast','więc','zaś']),\n" +
"	  rowne(Tsp, [pi,ri]) }",
"agl(_Rl, 3, I)  --> s(agl1e),\n" +
"	spoj(Tsp, I, ni),\n" +
"	{ rowne(I, ['bowiem','natomiast','więc','zaś']),\n" +
"	  rowne(Tsp, [pi,ri]) }",
"agl(Rl, O, ni) --> s(agl2), agl1(Rl, O)",
"agl1(R/poj, 1)    --> s(agl3), morfagl(m, R/poj, 1)",
"agl1(R/mno, 1)   \n" +
"                --> s(agl4), morfagl('śmy', R/mno, 1)",
"agl1(R/poj, 2)    --> s(agl5), morfagl('ś', R/poj, 2)",
"agl1(R/mno, 2) --> \n" +
"	s(agl6), morfagl('ście', R/mno, 2)",
"kor(K, I) --> s(kor1), przyimek(K, P), \n" +
"	kor1(P),\n" +
"	spoj(Tsp, I, ni),\n" +
"	{ rowne(I, ['bowiem','natomiast','więc','zaś']),\n" +
"	  rowne(Tsp, [pi,ri]) }",
"kor(K, ni) --> s(kor1x),\n" +
"	przyimek(K, P),\n" +
"	kor1(P)",
"kor(P, ni)     --> s(kor2), kor1(P)",
"kor1(P)        --> s(kor3n), zaimrzecz(to, P, r(mn(n),nmo(np(n)))/poj)",
" znakkonca(p)            --> s(int1), [morf('?',_,interp)]",
" znakkonca(np) --> s(int2), [morf('.',_,interp)]",
" znakkonca(np) --> s(int3), [morf('!',_,interp)]",
" znakkonca(np) --> s(int4), [morf('.',_,interp)],\n" +
"	[morf('.',_,interp)],\n" +
"	[morf('.',_,interp)]",
"przecsp --> s(int5), [morf('','',przecsp)]",
"przecsp           --> s(int6), przec",
"przec             --> s(int13), [morf(_,',',interp)]",
"morfagl(F, _R/L, O)      --> s(jel1), [morf(F, 'być', aglt:Num:Per:_:_)], \n" +
"                          { liczba(Num,L), osoba(Per,O) }",
"partykula(H)           --> s(jel2), [morf(_,H,qub)]",
"przyimek(F, P)         --> s(jel3), [morf(_,F,prep:Cases)], \n" +
"                          { przypadki(Cases,P) }",
"przyimek(F, P)         --> s(jel3), [morf(_,F,prep:Cases:_)], \n" +
"                          { przypadki(Cases,P) }",
"spojnik(F)             --> s(jel4), [morf(_,F,conj)]",
"zaimrzecz(H, P, R/L)    --> s(jel5),\n" +
"	[morf(_,H,psubst:Num:Cases:Gend)], \n" +
"	{ liczba(Num,L), przypadki(Cases,P), rodzaj(Gend,R) }",
"zaimprzym(H, P, R/L)    --> s(jel6),\n" +
"	[morf(_,H,padj:Num:Cases:Gend:pos)],\n" +
"	{ liczba(Num,L), przypadki(Cases,P),\n" +
"	  rodzaj(Gend,R) }",
"zaimprzys(H)           --> s(jel7), [morf(_,H,padv)]",
"formarzecz( P, R/L )    --> s(n_rz1), \n" +
"	[morf(_,_,subst:Num:Cases:Gend)], \n" +
"	{ liczba(Num,L), przypadki(Cases,P), rodzaj(Gend,R) }",
"formarzecz( P, R/L )    --> s(n_rz2), \n" +
"	[morf(_,_,depr:Num:Cases:Gend)], \n" +
"	{ liczba(Num,L), przypadki(Cases,P), rodzaj(Gend,R) }",
"formarzecz( P, R/L )    --> s(n_rz3), \n" +
"	[morf(_,_,ger:Num:Cases:Gend:_:_)], \n" +
"	{ liczba(Num,L), przypadki(Cases,P), rodzaj(Gend,R) }",
"formaprzym( P, R/L, St ) --> s(n_pt1),\n" +
"	[morf(_,_,adj:Num:Cases:Gend:Degr)],\n" +
"	{ liczba(Num,L), przypadki(Cases,P),\n" +
"	  rodzaj(Gend,R), stopien(Degr,St) }",
"formaprzym( P, R/L, St ) --> s(n_pt2),\n" +
"	[morf(_,_,adja)],\n" +
"	[morf('-','-',interp)],\n" +
"	formaprzym( P, R/L, St)",
"formaprzym( P, R/L, row ) --> s(n_pt3),\n" +
"	[morf(_,_,ppas:Num:Cases:Gend:_)],\n" +
"	{ liczba(Num,L), przypadki(Cases,P),\n" +
"	  rodzaj(Gend,R) }",
"formaprzym( P, R/L, row ) --> s(n_pt4),\n" +
"	[morf(_,_,pact:Num:Cases:Gend:_)],\n" +
"	{ liczba(Num,L), przypadki(Cases,P),\n" +
"	  rodzaj(Gend,R) }",
"formaprzym( P, R/L, row ) --> s(n_pt5),\n" +
"	[morf(_,_,pact:Num:Cases:Gend:_)],\n" +
"	[morf(_,'się',qub)],\n" +
"	{ liczba(Num,L), przypadki(Cases,P),\n" +
"	  rodzaj(Gend,R) }",
"formaprzysl( St ) --> s(n_ps),\n" +
"	[morf(_,_,adv:Degr)],\n" +
"	{ stopien(Degr,St) }",
"zaimos( P, R/L, O ) --> s(n_zo1),\n" +
"	[morf(_,_,ppron12:Num:Cases:Gend:Per)],\n" +
"	{ liczba(Num,L), przypadki(Cases,P),\n" +
"	  rodzaj(Gend,R), osoba(Per,O) }",
"zaimos( P, R/L, O ) --> s(n_zo2),\n" +
"	[morf(_,_,ppron12:Num:Cases:Gend:Per:_)],\n" +
"	{ liczba(Num,L), przypadki(Cases,P),\n" +
"	  rodzaj(Gend,R), osoba(Per,O) }",
"zaimos( P, R/L, O ) --> s(n_zo3),\n" +
"	[morf(_,_,ppron3:Num:Cases:Gend:Per:_)],\n" +
"	{ liczba(Num,L), przypadki(Cases,P),\n" +
"	  rodzaj(Gend,R), osoba(Per,O) }",
"formaczas( Wf, A, C, T, Rl, O, Wym, K ) --> s(n_cz1),\n" +
"	formaczas1( n, Wf, A, C, T, Rl, O, Wym, K )",
"formaczas( Wf, A, C, T, Rl, O, Wym, K ) --> s(n_cz2),\n" +
"	formaczas1( s, Wf, A, C, T, Rl, O, Wym, K ),\n" +
"	[morf(_,'się',qub)]",
"formaczas( Wf, A, C, T, Rl, O, Wym, K ) --> s(n_cz3),\n" +
"	[morf(_,'się',qub)],\n" +
"	formaczas1( s, Wf, A, C, T, Rl, O, Wym, K )",
"formaczas1( S, os, A, C, ozn, _R/L, O, Wym, _K ) --> s(n_cz4),\n" +
"	[morf(_,H,fin:Num:Per:As)],\n" +
"	{ aspekt(As,A), czas(fin,A,C),\n" +
"	  osoba(Per,O), liczba(Num,L), rekcja(H,S,Wym) }",
"formaczas1( S, os, nd, przy, ozn, _R/L, O, Wym, _K ) --> s(n_cz5),\n" +
"	[morf(_, być, bedzie:Num:Per:imperf)],\n" +
"	{ osoba(Per,O), liczba(Num,L), rekcja(być,S,Wym) }",
"przyzlo( S, _RL, Wym, _K ) --> s(n_czp1),\n" +
"	[morf(_,H,inf:As)],\n" +
"	{ aspekt(As,nd), rekcja(H,S,Wym) }",
"przyzlo( S, R/L, Wym, _K ) --> s(n_czp2),\n" +
"	[morf(_,H,praet:Num:Gend:AsAgl)],\n" +
"	{ asagl(AsAgl, As, nagl), aspekt(As,nd),\n" +
"	  liczba(Num,L), rodzaj(Gend,R), rekcja(H,S,Wym) }",
"formaczas1( S, os, nd, przy, ozn, R/L, O, Wym, _K ) --> s(n_cz6),\n" +
"	[morf(_, być, bedzie:Num:Per:imperf)],\n" +
"	{ osoba(Per,O), liczba(Num,L) },\n" +
" 	przyzlo( S, R/L, Wym, K )",
"formaczas1( S, os, nd, przy, ozn, R/L, O, Wym, _K ) --> s(n_cz7),\n" +
" 	przyzlo( S, R/L, Wym, K ),\n" +
"	[morf(_, być, bedzie:Num:Per:imperf)],\n" +
"	{ osoba(Per,O), liczba(Num,L) }",
"formaczas1( n, os, nd, przy, ozn, R/L, O, Wym, _K ) --> s(n_cz8),\n" +
"	[morf(_, być, bedzie:Num:Per:imperf)],\n" +
"	[morf(_,'się',qub)],\n" +
"	{ osoba(Per,O), liczba(Num,L) },\n" +
" 	przyzlo( s, R/L, Wym, K )",
"formaczas1( n, os, nd, przy, ozn, R/L, O, Wym, _K ) --> s(n_cz9),\n" +
" 	przyzlo( s, R/L, Wym, K ),\n" +
"	[morf(_,'się',qub)],\n" +
"	[morf(_, być, bedzie:Num:Per:imperf)],\n" +
"	{ osoba(Per,O), liczba(Num,L) }",
"formaczas1( S, os, A, prze, ozn, R/L, 3, Wym, _K ) --> s(n_cz10),\n" +
"	[morf(_,H,praet:Num:Gend:AsAgl)],\n" +
"	{ asagl(AsAgl, As, nagl), aspekt(As,A),\n" +
"	  liczba(Num,L), rodzaj(Gend,R), rekcja(H,S,Wym) }",
"formaczas1( S, os, A, prze, ozn, R/L, O, Wym, _K ) --> s(n_cz11),\n" +
"	[morf(_,H,praet:Num:Gend:AsAgl)],\n" +
"	{ asagl(AsAgl, As, agl), aspekt(As,A),\n" +
"	liczba(Num,L), rodzaj(Gend,R), rekcja(H,S,Wym) },\n" +
"	[morf(_F, 'być', aglt:Num:Per:_:_)], \n" +
"	{ osoba(Per,O) }",
"condaglt(L,3) --> s(n_cza1),\n" +
"	[morf(_,by,qub)]",
"	\n" +
"condaglt(L,O) --> s(n_cza2),\n" +
"	[morf(_,by,qub)],\n" +
"	[morf(_F, 'być', aglt:Num:Per:_:_)], \n" +
"	{ liczba(Num,L), osoba(Per,O) }",
"formaczas1( S, os, A, _C, war, R/L, O, Wym, _K ) --> s(n_cz12),\n" +
"	[morf(_,H,praet:Num:Gend:AsAgl)],\n" +
"	{ asagl(AsAgl, As, nagl), aspekt(As,A),\n" +
"	liczba(Num,L), rodzaj(Gend,R), rekcja(H,S,Wym) },\n" +
"	condaglt(L,O)",
"formaczas1( S, os, A, _C, war, R/L, O, Wym, _K ) --> s(n_cz13),\n" +
"	condaglt(L, O),\n" +
"	[morf(_,H,praet:Num:Gend:AsAgl)],\n" +
"	{ asagl(AsAgl, As, nagl), aspekt(As,A),\n" +
"	liczba(Num,L), rodzaj(Gend,R), rekcja(H,S,Wym) }",
"formaczas1( n, os, A, _C, war, R/L, O, Wym, _K ) --> s(n_cz14),\n" +
"	[morf(_,H,praet:Num:Gend:AsAgl)],\n" +
"	[morf(_,'się',qub)],\n" +
"	{ asagl(AsAgl, As, nagl), aspekt(As,A),\n" +
"	liczba(Num,L), rodzaj(Gend,R), rekcja(H,s,Wym) },\n" +
"	condaglt(L,O)",
"formaczas1( n, os, A, _C, war, R/L, O, Wym, _K ) --> s(n_cz15),\n" +
"	condaglt(L, O),\n" +
"	[morf(_,'się',qub)],\n" +
"	[morf(_,H,praet:Num:Gend:AsAgl)],\n" +
"	{ asagl(AsAgl, As, nagl), aspekt(As,A),\n" +
"	liczba(Num,L), rodzaj(Gend,R), rekcja(H,s,Wym) }",
"formaczas1( S, os, A, przy, roz, _R/L, O, Wym, _K ) --> s(n_cz16),\n" +
"	[morf(_,H,impt:Num:Per:As)],\n" +
"	{ aspekt(As,A),\n" +
"	  osoba(Per,O), liczba(Num,L), rekcja(H,S,Wym) }",
"formaczas1( S, os, A, przy, roz, _R/L, O, Wym, _K ) --> s(n_cz17),\n" +
"	[morf(_,niech,qub)],\n" +
"	[morf(_,H,fin:Num:Per:As)],\n" +
"	{ (Num=sg, Per\=sec ; Num=pl, Per=ter),\n" +
"	  aspekt(As,A),\n" +
"	  osoba(Per,O), liczba(Num,L), rekcja(H,S,Wym) }",
"formaczas1( n, os, A, przy, roz, _R/L, O, Wym, _K ) --> s(n_cz18),\n" +
"	[morf(_,niech,qub)],\n" +
"	[morf(_,'się',qub)],\n" +
"	[morf(_,H,fin:Num:Per:As)],\n" +
"	{ (Num=sg, Per\=sec ; Num=pl, Per=ter),\n" +
"	  aspekt(As,A),\n" +
"	  osoba(Per,O), liczba(Num,L), rekcja(H,s,Wym) }",
"formaczas1( S, bos, A, prze, ozn, _RL, _O, NWym, _K ) --> s(n_cz19),\n" +
"	[morf(_,H,imps:As)],\n" +
"	{ aspekt(As,A), rekcja(H,S,Wym), wykluczpodmiot(Wym,NWym) }",
"formaczas1( S, bos, A, _C, war, _RL, _O, NWym, _K ) --> s(n_cz20),\n" +
"	[morf(_,H,imps:As)],\n" +
"	[morf(_,by,qub)],\n" +
"	{ aspekt(As,A), rekcja(H,S,Wym), wykluczpodmiot(Wym,NWym) }",
"formaczas1( S, bos, A, _C, war, _RL, _O, NWym, _K ) --> s(n_cz21),\n" +
"	[morf(_,by,qub)],\n" +
"	[morf(_,H,imps:As)],\n" +
"	{ aspekt(As,A), rekcja(H,S,Wym), wykluczpodmiot(Wym,NWym) }",
"formaczas1( n, bos, A, _C, war, _RL, _O, NWym, _K ) --> s(n_cz22),\n" +
"	[morf(_,H,imps:As)],\n" +
"	[morf(_,'się',qub)],\n" +
"	[morf(by,by,qub)],\n" +
"	{ aspekt(As,A), rekcja(H,s,Wym), wykluczpodmiot(Wym,NWym) }",
"formaczas1( n, bos, A, _C, war, _RL, _O, NWym, _K ) --> s(n_cz23),\n" +
"	[morf(_,by,qub)],\n" +
"	[morf(_,'się',qub)],\n" +
"	[morf(_,H,imps:As)],\n" +
"	{ aspekt(As,A), rekcja(H,s,Wym), wykluczpodmiot(Wym,NWym) }",
"formaczas1( S, bok, A, _C, _T, _RL, _O, NWym, _K ) --> s(n_cz24),\n" +
"	[morf(_,H,inf:As)],\n" +
"	{ aspekt(As,A), rekcja(H,S,Wym), wykluczpodmiot(Wym,NWym) }",
"formaczas1( S, psu, A, _C, _T, _RL, _O, NWym, _K ) --> s(n_cz25),\n" +
"	[morf(_,H,pant:As)],\n" +
"	{ aspekt(As,A), rekcja(H,S,Wym), wykluczpodmiot(Wym,NWym) }",
"formaczas1( S, psw, A, _C, _T, _RL, _O, NWym, _K ) --> s(n_cz26),\n" +
"	[morf(_,H,pcon:As)],\n" +
"	{ aspekt(As,A), rekcja(H,S,Wym), wykluczpodmiot(Wym,NWym) }",
"formaczas1( S, os, nd, ter, ozn, _RL, _O, Wym, _K ) --> s(n_cz27),\n" +
"	[morf(_,H,pred)],\n" +
"	{ rekcja(H,S,Wym) }",
"formaczas1( S, os, nd, przy, ozn, _RL, _O, Wym, _K ) --> s(n_cz28),\n" +
"	[morf(będzie, być, bedzie:sg:ter:imperf)],\n" +
"	[morf(_,H,pred)],\n" +
"	{ rekcja(H,S,Wym) }",
"formaczas1( S, os, nd, przy, ozn, _RL, _O, Wym, _K ) --> s(n_cz29),\n" +
"	[morf(_,H,pred)],\n" +
"	[morf(będzie, być, bedzie:sg:ter:imperf)],\n" +
"	{ rekcja(H,S,Wym) }",
"formaczas1( S, os, nd, prze, ozn, _RL, _O, Wym, _K ) --> s(n_cz30),\n" +
"	[morf(było, być, praet:sg:_:imperf)],\n" +
"	[morf(_,H,pred)],\n" +
"	{ rekcja(H,S,Wym) }",
"formaczas1( S, os, nd, prze, ozn, _RL, _O, Wym, _K ) --> s(n_cz31),\n" +
"	[morf(_,H,pred)],\n" +
"	[morf(było, być, praet:sg:_:imperf)],\n" +
"	{ rekcja(H,S,Wym) }",
"formaczas1( S, os, nd, _C, war, _RL, _O, Wym, _K ) --> s(n_cz32),\n" +
"	[morf(_,H,pred)],\n" +
"	[morf(_,by,qub)],\n" +
"	{ rekcja(H,S,Wym) }",
"formaczas1( S, os, nd, _C, war, _RL, _O, Wym, _K ) --> s(n_cz33),\n" +
"	[morf(_,by,qub)],\n" +
"	[morf(_,H,pred)],\n" +
"	{ rekcja(H,S,Wym) }",
"formaczas1( S, bok, nd, _C, _T, _RL, _O, Wym, _K ) --> s(n_cz34),\n" +
"	[morf(_, być, inf:imperf)],\n" +
"	[morf(_,H,pred)],\n" +
"	{ rekcja(H,S,Wym) }",
"formaczas1( S, os, A, ter, ozn, R/L, 3, Wym, _K ) --> s(n_cz35),\n" +
"	[morf(_,H,winien:Num:Gend:AsAgl)],\n" +
"	{ asagl(AsAgl, As, nagl), aspekt(As,A),\n" +
"	  liczba(Num,L), rodzaj(Gend,R), rekcja(H,S,Wym) }",
"formaczas1( S, os, A, ter, ozn, R/L, O, Wym, _K ) --> s(n_cz36),\n" +
"	[morf(_,H,winien:Num:Gend:AsAgl)],\n" +
"	{ asagl(AsAgl, As, agl), aspekt(As,A),\n" +
"	liczba(Num,L), rodzaj(Gend,R), rekcja(H,S,Wym) },\n" +
"	[morf(_F, 'być', aglt:Num:Per:_:_)], \n" +
"	{ osoba(Per,O) }",
":-style_check(-singleton)",
":-op(100, fy, @)",
"wypowiedzenie --> s(w1), \n" +
"	zr(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), _),\n" +
"	znakkonca(Z1),\n" +
"	{ zrowne( Z, [Z1], SwZ ) }",
"zr(Wf, A, C, T, Rl, O, Neg, I, Z, X)\n" +
"--> s(r1), zsz(Wf, A, C, T, Rl, O, Neg, I, Z, @X)",
"zr(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r2), zsz(Wf, A, C, T, Rl, O, Neg, I, z(npp(SwZ),Z1), _),\n" +
"	{ oblnp(Z1, Z) },\n" +
"	przec,\n" +
"	spoj(rc, Oz, ni),\n" +
"	zsz(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ2,Z2), _),\n" +
"	{ zrowne(Z2, [p], SwZ2) }",
"zr(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r3), zsz(Wf, A, C, T, Rl, O, Neg, I, z(npp(SwZ),Z1), _),\n" +
"	{ oblnp(Z1, Z) },\n" +
"	przec,\n" +
"	zsz(Wf1, A1, C1, T1, Rl1, O1, Neg1, I1, z(SwZ2,Z2), _),\n" +
"	{ zrowne(Z2, [p], SwZ2),\n" +
"          rowne(I1, ['natomiast','zaś']) }",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(r4), spoj(rl, Oz, I), \n" +
"	zsz(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z), _),\n" +
"	{ zrowne(Z, ['aż1','bo','bowiem','chociaż','czy','jak','jeśli',\n" +
"	             'np','npt','podczas','ponieważ','że'], NZ) },\n" +
"	przec,\n" +
"	spoj(rp, Oz, ni),\n" +
"	zsz(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, NZ, NNZ),\n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(r5), zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), _),\n" +
"	{ zrowne(Z, ['aż1','bo','bowiem','chociaż','czy','jak','jeśli',\n" +
"	             'np','npt','podczas','ponieważ','że'], NZ) },\n" +
"	przec,\n" +
"	spoj(rc, Oz, ni),\n" +
"	zsz(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, NZ, NNZ),\n" +
"          oblneg(Oz, Neg0, Neg, Neg1) }",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(r6), zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), _),\n" +
"	{ zrowne(Z, ['aż1','bo','bowiem','chociaż','czy','jak','jeśli',\n" +
"	             'np','npt','podczas','ponieważ','że'], NZ) },\n" +
"	przec,\n" +
"	zsz(Wf1, A1, C1, T1, Rl1, O1, Neg1, I1, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, NZ, NNZ),\n" +
"          rowne(I1, ['natomiast','zaś']), \n" +
"	  oblneg(Oz, Neg0, Neg, Neg1)}",
"zr(Wf, A, C, T, Rl, 3, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r7), spoj(rl, Oz, I), \n" +
"	zsz(Wf, A, C, T, Rl, 3, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['byxx','choćby','czyżby','gdyby',\n" +
"	              'jakby','jakoby','żeby'], NZ) },\n" +
"	przec,\n" +
"	spoj(rp, Oz, ni),\n" +
"	zsz(Wf, A1, C1, T1, Rl1, 3, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r8), zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['byxx','choćby','czyżby','gdyby',\n" +
"	              'jakby','jakoby','żeby'], NZ) },\n" +
"	przec,\n" +
"	spoj(rc, Oz, ni),\n" +
"	zsz(Wf, A1, C1, T1, Rl1, 3, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          oblneg(Oz, Neg0, Neg, Neg1) }",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r9), zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['byxx','choćby','czyżby','gdyby',\n" +
"	              'jakby','jakoby','żeby'], NZ) },\n" +
"	przec,\n" +
"	zsz(Wf, A1, C1, T1, Rl1, 3, Neg1, I1, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          rowne(I1, ['natomiast','zaś']), \n" +
"	  oblneg(Oz, Neg0, Neg, Neg1) }",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r10), spoj(rl,Oz,I), \n" +
"	zsz(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż1xx','boxx','dopóki','gdyxx','npxx','npxxt',\n" +
"	              'zanim','zanimxx'], NZ) },\n" +
"	przec,\n" +
"	spoj(rp, Oz, ni),\n" +
"	zsz(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r11), zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż1xx','boxx','dopóki','gdyxx','npxx','npxxt',\n" +
"	              'zanim','zanimxx'], NZ) },\n" +
"	przec,\n" +
"	spoj(rc, Oz, ni),\n" +
"	zsz(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r12), zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż1xx','boxx','dopóki','gdyxx','npxx','npxxt',\n" +
"	              'zanim','zanimxx'], NZ) },\n" +
"	przec,\n" +
"	zsz(Wf1, A1, C, T, Rl1, O1, Neg1, I1, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          rowne(I1, ['natomiast','zaś']), \n" +
"	  oblneg(Oz, Neg0, Neg, Neg1) }",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r13), spoj(rl,Oz,I), \n" +
"	zsz(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż2','box','gdyx','npx','npxt'], NZ) },\n" +
"	przec,\n" +
"	spoj(rp, Oz, ni),\n" +
"	zsz(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"        { zrowne(Z2, NZ, Z),\n" +
"	  oblneg(Oz, Neg0, Neg, Neg1) }",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r14), zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż2','box','gdyx','npx','npxt'], NZ) },\n" +
"	przec,\n" +
"	spoj(rc, Oz, ni),\n" +
"	zsz(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"        oblneg(Oz, Neg0, Neg, Neg1)}",
"zr(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(r15), zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż2','box','gdyx','npx','npxt'], NZ) },\n" +
"	przec,\n" +
"	zsz(Wf1, A1, C, T, Rl1, O1, Neg1, I1, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"        rowne(I1, ['natomiast','zaś']), \n" +
"        oblneg(Oz, Neg0, Neg, Neg1)}",
"zsz(Wf, A, C, T, Rl, O, Neg, I, Z, X)\n" +
"--> s(s1), zj(Wf, A, C, T, Rl, O, Neg, I, Z, Oz, @X),\n" +
"	{ rozne(Oz, lub)}",
"zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(s2), zp(Wf, A, C, T, Rl, O, Neg, I, z(pnpp(SwZ),Z1), _),\n" +
"	{ oblpnp(Z1, Z) },\n" +
"	zj(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ2,Z2), Oz, _),\n" +
"	{ zrowne(Z2, [p], SwZ2),\n" +
"	  rozne(Oz, przec) }",
"zsz(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(s3), zj(Wf, A, C, T, Rl, O, Neg, I, z(pnpp(SwZ),Z1), przec, _), \n" +
"	{ oblpnp(Z1, Z) },\n" +
"	spoj(szk, Oz, ni),\n" +
"	{ rozne(Oz, przec) },\n" +
"	zp(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ2,Z2), _),\n" +
"	{ zrowne(Z2, [p], SwZ2) }",
"zsz(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,NZ), @ @ @ @0)\n" +
"--> s(s4), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _), \n" +
"	{ zrowne(Z1, ['aż1','bo','bowiem','chociaż',\n" +
"	              'czy','jak','jeśli','np','npt',\n" +
"		      'podczas','ponieważ','że'], NZ1) },\n" +
"        zj(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), Oz, _),\n" +
"	{ zrowne(Z2, NZ1, NZ),\n" +
"          rozne(Oz, przec), \n" +
"	  oblneg(Oz, Neg0, Neg, Neg1) }",
"zsz(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,NZ), @ @ @ @0)\n" +
"--> s(s5), zj(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), przec, _),\n" +
"	{ zrowne(Z1, ['aż1','bo','bowiem','chociaż',\n" +
"	              'czy','jak','jeśli','np','npt',\n" +
"		      'podczas','ponieważ','że'], NZ1) },\n" +
"        spoj(szk,Oz,ni),\n" +
"	zp(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ1, NZ),\n" +
"          oblneg(Oz, Neg0, Neg, Neg1) }",
"zsz(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(s6), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['byxx','choćby','czyżby',\n" +
"	              'gdyby','jakby','jakoby','żeby'], NZ) },\n" +
"	zj(Wf, A1, C1, T1, Rl1, 3, Neg1, ni, z(SwZ,Z2), Oz, _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          rozne(Oz, przec),\n" +
"	  oblneg(Oz, Neg0, Neg, Neg1) }",
"zsz(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(s7), zj(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), przec, _), \n" +
"	{ zrowne(Z1, ['byxx','choćby','czyżby',\n" +
"	              'gdyby','jakby','jakoby','żeby'], NZ) },\n" +
"	spoj(szk, Oz, ni),\n" +
"	zp(Wf, A1, C1, T1, Rl1, 3, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          oblneg(Oz, Neg0, Neg, Neg1) }",
"zsz(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(s8), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż1xx','boxx','dopóki','gdyxx',\n" +
"	              'npxx','npxxt','zanim','zanimxx'], NZ) },\n" +
"	zj(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), Oz, _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          rozne(Oz, przec),\n" +
"	  oblneg(Oz, Neg0, Neg, Neg1) }",
"zsz(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(s9), zj(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), przec, _), \n" +
"	{ zrowne(Z1, ['aż1xx','boxx','dopóki','gdyxx',\n" +
"	              'npxx','npxxt','zanim','zanimxx'], NZ) },\n" +
"	spoj(szk, Oz, ni),\n" +
"	zp(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"        oblneg(Oz, Neg0, Neg, Neg1)}",
"zsz(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(s10), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż2','box','gdy','npx','npxt'], NZ) },\n" +
"	zj(Wf1, A1, C, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), Oz, _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          rozne(Oz, przec),\n" +
"	  oblneg(Oz, Neg0, Neg, Neg1)}",
"zsz(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(s11), zj(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), przec, _), \n" +
"	{ zrowne(Z1, ['aż2','box','gdy','npx','npxt'], NZ) },\n" +
"	spoj(szk, Oz, ni),\n" +
"	zp(Wf1, A1, C, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z),\n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg, I, Z, przec, X)\n" +
"--> s(j1), zp(Wf, A, C, T, Rl, O, Neg, I, Z, @X)",
"zj(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), przec, @ @ @ @0)\n" +
"--> s(j2), zp(Wf, A, C, T, Rl, O, Neg, I, z(pnpp(SwZ),Z2), _),\n" +
"	{ oblpnp(Z2, NZ) },\n" +
"	spoj(sz, przec, ni),\n" +
"	zp(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, NZ, Z) }",
"zj(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), przec, @ @ @ @0)\n" +
"--> s(j3), zp(Wf, A, C, T, Rl, O, Neg, I, z(pnpp(SwZ),Z2), _), \n" +
"	{ oblpnp(Z2, NZ) },\n" +
"	spoj(sz, przec, ni),\n" +
"	zj(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ,Z1), przec, _),\n" +
"	{ zrowne(Z1, NZ, Z) }",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), Oz, @ @ @ @0)\n" +
"--> s(j4), spoj(sz, Oz, I), \n" +
"	{ rozne(Oz, przec) },\n" +
"	zp(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż1','bo','bowiem','chociaż','czy','jak','jeśli',\n" +
"	              'np','npt','podczas','ponieważ','pz','że'], NZ) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	zp(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), Oz, @ @ @ @0)\n" +
"--> s(j5), spoj(sz, Oz, I), \n" +
"	{ rozne(Oz, przec) },\n" +
"	zp(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż1','bo','bowiem','chociaż','czy','jak','jeśli',\n" +
"	              'np','npt','podczas','ponieważ','pz','że'], NZ) },\n" +
"	przec,\n" +
"	zj(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), Oz, _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), przec, @ @ @ @0) --> s(j7), \n" +
"	zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _), \n" +
"	{ zrowne(Z1, ['aż1','bo','bowiem','chociaż','czy','jak','jeśli',\n" +
"	              'np','npt','podczas','ponieważ','pz','że'], Z2) }, \n" +
"        spoj(sz, przec, ni),\n" +
"	zj(Wf1, A1, C1, T1, Rl1, O1, Neg1, ni, z(SwZ,Z3), przec, _),\n" +
"	{ zrowne(Z3, Z2, Z),\n" +
"	  oblneg(Oz, Neg0, Neg, Neg1) }",
"zj(Wf, A, C, T, Rl, 3, Neg0, I, z(SwZ,Z), Oz, @ @ @ @0)\n" +
"--> s(j8), spoj(sz, Oz, I), \n" +
"	{ rozne(Oz, przec) },\n" +
"	zp(Wf, A, C, T, Rl, 3, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['byxx','choćby','czyżby','gdyby',\n" +
"	              'jakby','jakoby','żeby'], NZ) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	zp(Wf, A1, C1, T1, Rl1, 3, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, 3, Neg0, I, z(SwZ,Z), Oz, @ @ @ @0)\n" +
"--> s(j9), spoj(sz, Oz, I), \n" +
"	{ rozne(Oz, przec) },\n" +
"	zp(Wf, A, C, T, Rl, 3, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['byxx','choćby','czyżby','gdyby',\n" +
"	              'jakby','jakoby','żeby'], NZ) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	zj(Wf, A1, C1, T1, Rl1, 3, Neg1, ni, z(SwZ,Z2), Oz, _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), przec, @ @ @ @0)\n" +
"--> s(j10), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _), \n" +
"	{ zrowne(Z1, ['byxx','choćby','czyżby','gdyby',\n" +
"	              'jakby','jakoby','żeby'], NZ) },\n" +
"	spoj(szk, przec, ni),\n" +
"	zp(Wf, A1, C1, T1, Rl1, 3, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), przec, @ @ @ @0)\n" +
"--> s(j11), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _), \n" +
"	{ zrowne(Z1, ['byxx','choćby','czyżby','gdyby',\n" +
"	              'jakby','jakoby','żeby'], NZ) },\n" +
"	spoj(szk, przec, ni),\n" +
"	zj(Wf, A1, C1, T1, Rl1, 3, Neg1, ni, z(SwZ,Z2), przec, _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), Oz, @ @ @ @0)\n" +
"--> s(j12), spoj(sz, Oz, I), \n" +
"	{ rozne(Oz, przec) },\n" +
"	zp(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż1xx','boxx','dopóki','gdyxx','npxx','npxxt',\n" +
"	              'zanim','zanimxx'], NZ) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	zp(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), Oz, @ @ @ @0)\n" +
"--> s(j13), spoj(sz, Oz, I), \n" +
"	{ rozne(Oz, przec) },\n" +
"	zp(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż1xx','boxx','dopóki','gdyxx','npxx','npxxt',\n" +
"	              'zanim','zanimxx'], NZ) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	zj(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), Oz, _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), przec, @ @ @ @0)\n" +
"--> s(j14), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż1xx','boxx','dopóki','gdyxx','npxx','npxxt',\n" +
"	              'zanim','zanimxx'], NZ) },\n" +
"	spoj(szk, przec, ni),\n" +
"	zp(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), przec, @ @ @ @0)\n" +
"--> s(j15), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _), \n" +
"	{ zrowne(Z1, ['aż1xx','boxx','dopóki','gdyxx','npxx','npxxt',\n" +
"	              'zanim','zanimxx'], NZ) },\n" +
"	spoj(szk, przec, ni),\n" +
"	zj(Wf1, A1, C, T, Rl1, O1, Neg1, ni, z(SwZ,Z2), przec, _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), Oz, @ @ @ @0)\n" +
"--> s(j16), spoj(sz, Oz, I),\n" +
"	{ rozne(Oz, przec) },\n" +
"	zp(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż2','box','gdy','npx','npxt'], NZ) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	zp(Wf1, A1, C, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), Oz, @ @ @ @0)\n" +
"--> s(j17), spoj(sz, Oz, I), \n" +
"	{ rozne(Oz, przec) },\n" +
"	zp(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z1), _),\n" +
"	{ zrowne(Z1, ['aż2','box','gdy','npx','npxt'], NZ) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	zj(Wf1, A1, C, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), Oz, _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), przec, @ @ @ @0)\n" +
"--> s(j18), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _), \n" +
"	{ zrowne(Z1, ['aż2','box','gdy','npx','npxt'], NZ) },\n" +
"	spoj(szk, przec, ni),\n" +
"	zp(Wf1, A1, C, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zj(Wf, A, C, T, Rl, O, Neg0, I, z(SwZ,Z), przec, @ @ @ @0)\n" +
"--> s(j19), zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z1), _), \n" +
"	{ zrowne(Z1, ['aż2','box','gdy','npx','npxt'], NZ) },\n" +
"	spoj(szk, przec, ni),\n" +
"	zj(Wf1, A1, C, T1, Rl1, O1, Neg1, ni, z(SwZ,Z2), przec, _),\n" +
"	{ zrowne(Z2, NZ, Z), \n" +
"          oblneg(Oz, Neg0, Neg, Neg1)}",
"zp(Wf, A, C, T, Rl, O, Neg, I, Z, X)\n" +
"--> s(p1), ze(Wf, A, C, T, Rl, O, Wym, Neg, I, Z, br, @X)",
"zp(Wf, A, przy, T, Rl, O, Neg, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(p2), fzd(Oz, nk, A1, C1, T1, Neg1, I, _), \n" +
"	{ rowne(Oz, ['choćby','gdyby']) },\n" +
"	przec,\n" +
"	spoj(pp, Oz, ni),\n" +
"	ze(Wf, A, przy, T, Rl, O, Wym, Neg, ni, z(SwZ,Z), Oz, _),\n" +
"	{ oblzal(Z, NZ, Oz),\n" +
"	  zrozne(NZ, ['byxx','choćby','co','czyżby','gdyby','jakby',\n" +
"	             'jaki','jakoby','kto','który','pz','żeby'], NNZ)\n" +
"	   }",
"zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(p3), fzd(Oz, nk, A1, C, T1, Neg1, I, _),\n" +
"	{ rowne(Oz, ['dopóki','gdy']) },\n" +
"	przec,\n" +
"	spoj(pp, Oz, ni),\n" +
"	ze(Wf, A, C, T, Rl, O, Wym, Neg, ni, z(SwZ,Z), Oz, _),\n" +
"	{ oblzal(Z, NZ, Oz),\n" +
"	  zrozne(NZ, ['byxx','choćby','co','czyżby','gdyby','jakby',\n" +
"	             'jaki','jakoby','kto','który','pz','żeby'], NNZ)\n" +
"	   }",
"zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,NZ), @ @ @ @0)\n" +
"--> s(p4), fzd(Oz, nk, A1, C1, T1, Neg1, I, _),\n" +
"	{ rowne(Oz, ['chociaż','jeśli']) },\n" +
"	przec,\n" +
"	spoj(pp, Oz, ni),\n" +
"	ze(Wf, A, C, T, Rl, O, Wym, Neg, ni, z(SwZ,Z), br, _),\n" +
"	{ zrozne(Z, ['byxx','choćby','co','czyżby','gdyby','jakby',\n" +
"	             'jaki','jakoby','kto','który','pz','żeby'], NZ) }",
"zp(Wf, A, C, T, Rl, 3, Neg, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(p5), fzd(Oz, nk, A1, C1, T1, Neg1, I, _),\n" +
"	{ rowne(Oz, ['choćby','gdyby']) },\n" +
"	przec,\n" +
"	spoj(pp, Oz, ni),\n" +
"	ze(Wf, A, C, T, Rl, 3, Wym, Neg, ni, z(SwZ,Z), Oz, _),\n" +
"	{ oblzal(Z, NZ, Oz),\n" +
"	  zrowne(NZ, ['byxx','choćby','czyżby','gdyby',\n" +
"	             'jakby','jakoby','żeby'], NNZ)\n" +
"	    }",
"zp(Wf, A, C, T, Rl, 3, Neg, I, z(SwZ,NZ), @ @ @ @0)\n" +
"--> s(p5x), fzd(Oz, nk, A1, C1, T1, Neg1, I, _),\n" +
"	{ rowne(Oz, ['chociaż','jeśli']) },\n" +
"	przec,\n" +
"	spoj(pp, Oz, ni),\n" +
"	ze(Wf, A, C, T, Rl, 3, Wym, Neg, ni, z(SwZ,Z), br, _),\n" +
"	{ zrowne(Z, ['byxx','choćby','czyżby','gdyby',\n" +
"	             'jakby','jakoby','żeby'], NZ) }",
"zp(Wf, A, C, T, Rl, 3, Neg, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(p6), fzd(Oz, nk, A1, C1, T1, Neg1, I, _),\n" +
"	{ rowne(Oz, ['dopóki','gdy']) },\n" +
"	przec,\n" +
"	spoj(pp, Oz, ni),\n" +
"	ze(Wf, A, C, T, Rl, 3, Wym, Neg, ni, z(SwZ,Z), Oz, _),\n" +
"	{ oblzal(Z, NZ, Oz),\n" +
"	  zrowne(NZ, ['byxx','choćby','czyżby','gdyby',\n" +
"	             'jakby','jakoby','żeby'], NNZ)\n" +
"	    }",
"zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(p7), spoj(pl, Oz, I), \n" +
"	ze(Wf, A, C, T, Rl, O, Wym, Neg, ni, z(SwZ,Z), Oz, _),\n" +
"	{ oblzal(Z, NZ, Oz),\n" +
"	  zrozne(NZ, ['byxx','choćby','co','czyżby','gdyby','jakby',\n" +
"	             'jaki','jakoby','kto','który','pz','żeby'], NNZ)\n" +
"		   },\n" +
"	fzd(Oz, nk, A1, C, T1, Neg1, ni, _),\n" +
"	przec",
"zp(Wf, A, C, T, Rl, 3, Neg, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(p8), spoj(pl, Oz, I), \n" +
"	ze(Wf, A, C, T, Rl, 3, Wym, Neg, ni, z(SwZ,Z), Oz, _),\n" +
"	{ oblzal(Z, NZ, Oz),\n" +
"	  zrowne(NZ, ['byxx','choćby','czyżby','gdyby',\n" +
"	            'jakby','jakoby','żeby'], NNZ)\n" +
"	    },\n" +
"	fzd(Oz, nk, A1, C, T1, Neg1, ni, _),\n" +
"	przec",
"zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(p9), ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(npp(SwZ),Z2), br, _),\n" +
"	{ oblnp(Z2, Z) },\n" +
"	przec,\n" +
"	spoj(pc, bo, ni),\n" +
"	ze(Wf1, A1, C1, T1, Rl1, O1, Wym1, Neg1, ni, z(SwZ1,Z1), br, _),\n" +
"	{ zrowne(Z1, [p], SwZ1) }",
"zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,NZ), @ @ @ @0)\n" +
"--> s(p10), ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(npp(SwZ),Z2), 'więc', _),\n" +
"	{ oblzal(Z2, NZ2, 'więc'), oblnp(NZ2, NZ) },\n" +
"	przec,\n" +
"	spoj(pc, 'więc', ni),\n" +
"	ze(Wf1, A1, C1, T1, Rl1, O1, Wym1, Neg1, ni, z(SwZ1,Z1), br, _),\n" +
"	{ zrowne(Z1, [p], SwZ1) }",
"zp(Wf, A, C, T, Rl, O, Neg, I, Z, @ @ @ @0)\n" +
"--> s(p11), ze(Wf, A, C, T, Rl, O, Wym, Neg, I, Z, br, _), \n" +
"	przec,\n" +
"	spoj(pc, bo, ni),\n" +
"	ze(Wf1, A1, C1, T1, Rl1, O1, Wym1, Neg1, ni, z(SwZ1,Z1), br, _),\n" +
"	{ zrowne(Z1, [bo], SwZ1) }",
"zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(p12), ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,Z), 'więc', _),\n" +
"	{ oblzal(Z,NZ,'więc'),\n" +
"	  zrozne(NZ, ['byxx','choćby','co','czyżby','gdyby','jakby',\n" +
"	             'jaki','jakoby','kto','który',\n" +
"		     'p','px','pxx','pz','żeby'], NNZ)\n" +
"	   },\n" +
"	przec, \n" +
"	spoj(pc, 'więc', ni),\n" +
"	ze(Wf1, A1, C1, T1, Rl1, O1, Wym1, Neg1, ni, z(SwZ1,Z1), br, _),\n" +
"	{ zrowne(Z1, [np], SwZ1) }",
"zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), @ @ @ @0)\n" +
"--> s(p13), ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(npp(SwZ),Z2), br, _),\n" +
"	{ oblnp(Z2, Z) },\n" +
"	przec,\n" +
"	ze(Wf1, A1, C1, T1, Rl1, O1, Wym1, Neg1, bowiem, z(SwZ1,Z1), br, _),\n" +
"	{ zrowne(Z1, [p], SwZ1) }",
"zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,NZ), @ @ @ @0)\n" +
"--> s(p14), ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(npp(SwZ),Z2), 'więc', _),\n" +
"	{ oblzal(Z2,NZ2,'więc'), oblnp(NZ2, NZ) },\n" +
"	przec,\n" +
"	ze(Wf1, A1, C1, T1, Rl1, O1, Wym1, Neg1, 'więc', z(SwZ1,Z1), br, _),\n" +
"	{ zrowne(Z1, [p], SwZ1) }",
"zp(Wf, A, C, T, Rl, O, Neg, I, Z, @ @ @ @0)\n" +
"--> s(p15), ze(Wf, A, C, T, Rl, O, Wym, Neg, I, Z, br, _), \n" +
"	przec,\n" +
"	ze(Wf1, A1, C1, T1, Rl1, O1, Wym1, Neg1, bowiem, z(SwZ1,Z1), br, _),\n" +
"	{ zrowne(Z1, [bowiem], SwZ1) }",
"zp(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,NNZ), @ @ @ @0)\n" +
"--> s(p16), ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,Z), 'więc', _),\n" +
"	{ oblzal(Z, NZ, 'więc'),\n" +
"	  zrozne(NZ, ['byxx','choćby','co','czyżby','gdyby','jakby',\n" +
"	             'jaki','jakoby','kto','który',\n" +
"		     'p','px','pxx','pz','żeby'], NNZ)\n" +
"		   },\n" +
"	przec,\n" +
"	ze(Wf1, A1, C1, T1, Rl1, O1, Wym1, Neg1, 'więc', z(SwZ1,Z1), br, _),\n" +
"	{ zrowne(Z1, [np], SwZ1) }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e1), fl(A, C, Rl, O, Neg, I, z(SwZ1,Z1)), \n" +
"	wymagania([], Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,Z), Ow),\n" +
"	    [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ4,Z4))]),\n" +
"        { resztawym(ResztaWym),\n" +
"	zrowne(Z, ['p','px','pxx'], NZ), \n" +
"        zrowne(Z1, ['p','np'], SwZ1),\n" +
"        zrowne(Z2, ['p','np'], SwZ2),\n" +
"        zrowne(Z3, ['p','np'], SwZ3),\n" +
"        zrowne(Z4, ['p','np'], SwZ4) }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e2), fw(W1, K, A, C, Rl, O, Neg, I, z(SwZ1,Z1)),\n" +
"	{ zrowne(Z1, ['p','np'], SwZ1) },\n" +
"	wymagania([W1],  Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,Z), Ow),\n" +
"	    [W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"        { resztawym(ResztaWym),\n" +
"	  zrowne(Z, ['p','px','pxx'], NZ ), \n" +
"          zrowne(Z2, ['p','np'], SwZ2 ), \n" +
"          zrowne(Z3, ['p','np'], SwZ3 ) }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e3), ff(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,Z), Ow),\n" +
"	{ zrowne( Z, ['p','px','pxx'], NZ ) },\n" +
"	wymagane( Wym, ResztaWym,\n" +
"	          [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)), \n" +
"		   W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"		   W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"       { resztawym(ResztaWym),\n" +
"	 zrowne(Z1, ['p','np'], SwZ1 ),\n" +
"         zrowne(Z2, ['p','np'], SwZ2 ), \n" +
"         zrowne(Z3, ['p','np'], SwZ3 )}",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e4), fl(A, C, Rl, O, Neg, I, z(SwZ0,Z0)),\n" +
"	{ zrowne(Z0, [np], SwZ0) },\n" +
"	wymagania([], Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,Z), Ow),\n" +
"	    [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	     W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))]),\n" +
"       { resztawym(ResztaWym),\n" +
"	zrozne(Z, ['byxx','choćby','co','czyżby','gdyby','jakby',\n" +
"	            'jaki','jakoby','kto','który',\n" +
"		    'p','px','pxx','pz','żeby'], NZ),\n" +
"	zrowne( Z1, [np], SwZ1 ),\n" +
"	zrowne( Z2, [np], SwZ2 ),\n" +
"	zrowne( Z3, [np], SwZ3 )}",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e5), fw(W0, K, A, C, Rl, O, Neg, I, z(SwZ3,Z3)),\n" +
"	{ zrowne( Z3, [np], SwZ3 ) },\n" +
"	wymagania([W0],  Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,Z), Ow),\n" +
"	    [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	     W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2))]),\n" +
"	{ resztawym(ResztaWym),\n" +
"	  zrozne(Z, ['byxx','choćby','co','czyżby','gdyby','jakby',\n" +
"	    'jaki','jakoby','kto','który','p','px','pxx','pz','żeby'], NZ),\n" +
"	  zrowne(Z1, [np], SwZ1),\n" +
"	  zrowne(Z2, [np], SwZ2)}",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e6), ff(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,Z), Ow),\n" +
"	{ zrozne(Z, ['byxx','choćby','co','czyżby','gdyby','jakby','jaki',\n" +
"	    'jakoby','kto','który','p','px','pxx','pz','żeby'], NZ) },\n" +
"	wymagane(Wym, ResztaWym, \n" +
"	         [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1) ),\n" +
"		  W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2) ),\n" +
"		  W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3) )]),\n" +
"	{ resztawym(ResztaWym),\n" +
"	  zrowne( Z1, [np], SwZ1 ),\n" +
"	  zrowne( Z2, [np], SwZ2 ),\n" +
"	  zrowne( Z3, [np], SwZ3 ) }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NNZ), Ow, @ @ @ @0)\n" +
"--> s(e7), fl(A, C, Rl, O, Neg, I, z(SwZ,Z)),\n" +
"	{ zrowne( Z, ['byxx','choćby','czyżby',\n" +
"	            'gdyby','jakby','jakoby','żeby'], NZ ) },\n" +
"	wymagania([], Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, 3, Wym, K, Neg, ni, z(SwZ,WZ), Ow),\n" +
"	    [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	     W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))]),\n" +
"       { resztawym(ResztaWym),\n" +
"	 zrowne( NZ, WZ, NNZ ),\n" +
"	 zrowne( Z1, [np], SwZ1 ),\n" +
"	 zrowne( Z2, [np], SwZ2 ),\n" +
"	 zrowne( Z3, [np], SwZ3 ) }",
"ze(Wf, A, C, T, Rl, 3, Wym, Neg, ni, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e7e1), fw(W0, K, A, C, Rl, 3, Neg, ni, z(SwZ3,Z3)),\n" +
"	{ zrowne( Z3, [np], SwZ3 ) },\n" +
"	wymagania([W0],  Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, 3, Wym, K, Neg, ni, z(SwZ,Z), Ow),\n" +
"	    [W1/fw(W1, K, A, C, Rl, 3, Neg, ni, z(SwZ1,Z1)),\n" +
"	     W2/fw(W2, K, A, C, Rl, 3, Neg, ni, z(SwZ2,Z2))]),\n" +
"	{ resztawym(ResztaWym),\n" +
"	  zrowne(Z, ['byxx','choćby','czyżby',\n" +
"	            'gdyby','jakby','jakoby','żeby'], NZ),\n" +
"	  zrowne(Z1, [np], SwZ1),\n" +
"	  zrowne(Z2, [np], SwZ2)}",
"ze(Wf, A, C, T, Rl, 3, Wym, Neg, ni, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e7e2), ff(Wf, A, C, T, Rl, 3, Wym, K, Neg, ni, z(SwZ,Z), Ow),\n" +
"	{ zrowne(Z, ['byxx','choćby','czyżby',\n" +
"	            'gdyby','jakby','jakoby','żeby'], NZ) },\n" +
"	wymagane(Wym, ResztaWym, \n" +
"	         [W1/fw(W1, K, A, C, Rl, 3, Neg, ni, z(SwZ1,Z1) ),\n" +
"		  W2/fw(W2, K, A, C, Rl, 3, Neg, ni, z(SwZ2,Z2) ),\n" +
"		  W3/fw(W3, K, A, C, Rl, 3, Neg, ni, z(SwZ3,Z3) )]),\n" +
"	{ resztawym(ResztaWym),\n" +
"	  zrowne( Z1, [np], SwZ1 ),\n" +
"	  zrowne( Z2, [np], SwZ2 ),\n" +
"	  zrowne( Z3, [np], SwZ3 ) }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NNZ), Ow, @ @ @ @0)\n" +
"--> s(e8), fl(A, C, Rl, O, Neg, I, z(SwZ,Z)),\n" +
"	{ zrowne( Z, [pz], NZ ) },\n" +
"	wymagania([], Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,FZ), Ow),\n" +
"	    [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	     W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))]),\n" +
"       { resztawym(ResztaWym),\n" +
"	 zrowne(NZ, FZ, NNZ ),\n" +
"	 zrowne(Z1, ['p','np'], SwZ1 ), \n" +
"         zrowne(Z2, ['p','np'], SwZ2 ), \n" +
"         zrowne(Z3, ['p','np'], SwZ3 )}",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e9), fw(W1, K, A, C, Rl, O, Neg, I, z(SwZ3,Z3)),\n" +
"	{ zrowne( Z3, [pz], SwZ3 ) },\n" +
"	wymagania([W1],  Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,Z), Ow),\n" +
"	    [W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2))] ),\n" +
"	{ resztawym(ResztaWym),\n" +
"	  zrowne(Z, [pz], NZ),\n" +
"	  zrowne(Z1, ['p','np'], SwZ1), \n" +
"	  zrowne(Z2, ['p','np'], SwZ2)}",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e10), ff(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,Z), Ow),\n" +
"	{ zrowne( Z, [pz], NZ) },\n" +
"	wymagane( Wym, ResztaWym,\n" +
"	          [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)), \n" +
"		   W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"		   W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"       { resztawym(ResztaWym),\n" +
"	 zrowne(Z1, ['p','np'], SwZ1),\n" +
"         zrowne(Z2, ['p','np'], SwZ2),\n" +
"	 zrowne(Z3, ['p','np'], SwZ3)}",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NNZ), Ow, @ @ @ @0)\n" +
"--> s(e11), fl(A, C, Rl, O, Neg, I, z(SwZ,Z)),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który'], NZ) },\n" +
"	wymagania([],  Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,FZ), Ow),\n" +
"	    [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	     W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"       { resztawym(ResztaWym),\n" +
"	 zrowne( NZ, FZ, NNZ ),\n" +
"	 zrowne( Z1, [np], SwZ1),\n" +
"	 zrowne( Z2, [np], SwZ2),\n" +
"	 zrowne( Z3, [np], SwZ3) }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NNZ), Ow, @ @ @ @0)\n" +
"--> s(e12), fw(W1, K, A, C, Rl, O, Neg, I, z(SwZ,Z)),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który'], NZ) },\n" +
"	wymagania([W1],  Wym, ResztaWym,\n" +
"	    ff(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,FZ), Ow),\n" +
"	    [W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))]),\n" +
"       { resztawym(ResztaWym),\n" +
"	 zrowne( NZ, FZ, NNZ ),\n" +
"	 zrowne( Z2, [np], SwZ2),\n" +
"	 zrowne( Z3, [np], SwZ3) }",
"ze( Wf, A, C, T, Rl, O, Wym, Neg, I, z(_,Z), Ow, @ @ @ @0 )\n" +
"     --> s(e14), pyt( 'czyżby', ni ),\n" +
"       zr( Wf, A, C, T, Rl, O, Neg, I, z(SwZ1,Z1), _ ),\n" +
"       { zrowne( Z1, ['czyżby'], SwZ1 ),\n" +
"	 Z = ['p','px','pxx'] }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(_,Z), Ow, @ @ @ @0)\n" +
"--> s(e15), zr(Wf, A, C, T, Rl, O, Neg, I, z(SwZ1,Z1), _),\n" +
"	{ zrowne(Z1, [npt], SwZ1), Z=['p','px','pxx'] }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e16), fl(A, C, Rl, O, Neg, I, z(SwZ,Z)),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','p','px','pxx','pz'], NZ) },\n" +
"	zr(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ1,Z1), _),\n" +
"	{ zrowne(Z1, [npt], SwZ1) }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(_,Z), Ow, @ @ @ @0)\n" +
"--> s(e17), pyt(czy, I), \n" +
"	zr(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ1,Z1), _),\n" +
"	{ zrowne( Z1, [npt], SwZ1 ),\n" +
"	Z = ['p','px','pxx','pz'] }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,NZ), Ow, @ @ @ @0)\n" +
"--> s(e18), fl(A, C, Rl, O, Neg, I, z(SwZ1,Z1)),\n" +
"	{ zrowne(Z1, [np], SwZ1) },\n" +
"	zr(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z), _),\n" +
"	{ zrozne(Z, ['byxx','choćby','co','czyżby','gdyby','jakby',\n" +
"	             'jaki','jakoby','kto','który',\n" +
"		     'p','px','pxx','pz','żeby'], NZ) }",
"ze(Wf, A, C, T, Rl, O, Wym, Neg, I, z(SwZ,Z), Ow, X)\n" +
"--> s(e19), zr(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), @X)",
"ff(Wf, A, C, T, Rl, O, Wym, K, Neg, I, Z, Ow) --> s(fi1),\n" +
"	ff1(Wf, A, C, T, Rl, O, Wym, K, Neg, I, Z, Ow)",
"ff(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,NZ), Ow) --> s(fi2),\n" +
"	ff1(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,Z), Ow),\n" +
"	{ zrowne( Z, ['p','px','pxx','pz'], NZ ) }, \n" +
"	fl(A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	{ zrowne( Z1, ['np','p'], SwZ1 ) }",
"ff(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,NZ), Ow) --> s(fi3),\n" +
"	ff1(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,Z), Ow),\n" +
"	{ zrozne( Z, ['p','px','pxx','pz'], NZ) },\n" +
"	fl(A, C, Rl, O, Neg, ni, z(SwZ1,Z1)), \n" +
"	{ zrowne( Z1, [np], SwZ1 ) }",
"ff1(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,Z), Ow) --> s(fi4),\n" +
"	kweneg(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(ow(SwZ,Ow),Z)), \n" +
"	{ rowne( Wf, ['os','bos','bok'] ) }",
"fw(Tfw, K, A, C, Rl, O, Neg, I, Z) --> s(wy1),\n" +
"	fw1(Tfw, K, A, C, Rl, O, Neg, I, Z)",
"fw(Tfw, K, A, C, Rl, O, Neg, I, z(_,[p])) --> s(wy2),\n" +
"	fw1(Tfw, K, A, C, Rl, O, Neg, I, z(SwZ1,Z1)), \n" +
"	fl(A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	{ zplubnp(Z1,Z2,SwZ1,SwZ2) }",
"fw( Tfw, K, A, C, Rl, O, Neg, I, z(SwZ,NZ) ) --> s(wy3),\n" +
"	fw1( Tfw, K, A, C, Rl, O, Neg, I, z(SwZ,Z) ),\n" +
"	{ zrowne( Z, [pz], NZ ) },\n" +
"	fl( A, C, Rl, O, Neg, ni, z(SwZ1,Z1) ),\n" +
"	{ zrowne( Z1, ['np','p'], SwZ1 ) }",
"fw(Tfw, K, A, C, Rl, O, Neg, I, z(SwZ,NZ)) --> s(wy4),\n" +
"	fw1(Tfw, K, A, C, Rl, O, Neg, I, z(SwZ,Z)), \n" +
"	{ zrozne( Z, ['p','pz'], NZ ) },\n" +
"	fl(A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	{ zrowne( Z1, [np], SwZ1 ) }",
"fw1(infp(A1), K, A, C, Rl, O, Neg, I, Z)\n" +
"     --> s(wy6), fwe(bok, A1, C, T, Rl1, O1, wym([],_), K, Neg, I, Z)",
"                                                           \n" +
"fw1(prepnp(Pm,P), K, A, C, Rl, O, Neg, I, Z)\n" +
"     --> s(wy7), fpm(Pm, P, Neg, I, Z, Kl)",
"fw1(np(mian), K, A, C, Rl, O, Neg, I, Z)\n" +
"     --> s(wy8), fno(mian, Rl, O, Neg, I, Z, Kl, _)",
"fw1(np(bier), K, A, C, Rl, O, nie(Neg), I, Z)\n" +
"     --> s(wy9), fno(dop, Rl1, O1, nie(Neg), I, Z, Kl, _)",
"fw1(np(bier), K, A, C, Rl, O, tak, I, Z)\n" +
"     --> s(wy10), fno(bier, Rl1, O1, tak, I, Z, Kl, _)",
"fw1(np(P), K, A, C, Rl, O, Neg, I, Z)\n" +
"     --> s(wy11), fno(P, Rl1, O1, Neg, I, Z, Kl, _), \n" +
"       { rozne(P, ['mian','bier','wol'])}",
"fw1(adjp(mian), K, A, C, Rl, O, Neg, I, Z)\n" +
"     --> s(wy12), fpt(mian, Rl, St, Neg, I, Z, Kl, _)",
"fw1(adjp(bier), K, A, C, Rl, O, nie(Neg), I, Z)\n" +
"     --> s(wy13), fpt(dop, Rl, St, nie(Neg), I, Z, Kl, _)",
"fw1(adjp(bier), K, A, C, Rl, O, tak, I, Z)\n" +
"     --> s(wy14), fpt(bier, Rl, St, tak, I, Z, Kl, _)",
"fw1(adjp(narz), K, A, C, Rl, O, Neg, I, Z)\n" +
"     --> s(wy15), fpt(narz, Rl, St, Neg, I, Z, Kl, _)",
"fw1(advp, K, A, C, Rl, O, Neg, I, Z)\n" +
"     --> s(wy16), fps(St, Neg, I, Z, Kl, _)",
"fw1(sentp(Tfz), bier, A, C, Rl, O, nie(_), I, z(_,Z))\n" +
"--> s(wy17), fzd(Tfz, dop, A1, C1, T1, Neg1, I, _),\n" +
"	przec,\n" +
"	{ rowne(Tfz, ['aż1','czy','jak','jakby','jakoby',\n" +
"	              'mie1','mie2','mie3','pz','że','żeby']),\n" +
"	  Z = [p,np,pz,co,jaki,kto,'który'] }",
"fw1(sentp(Tfz), bier, A, C, Rl, O, tak, I, z(_,Z))\n" +
"--> s(wy18), fzd(Tfz, bier, A1, C1, T1, Neg1, I, _),\n" +
"	przec,\n" +
"	{ rowne(Tfz,['aż1','czy','jak','jakby','jakoby',\n" +
"	             'mie1','mie2','mie3','pz','że','żeby']),\n" +
"	Z = [p,np,pz,co,jaki,kto,'który'] }",
"fw1(sentp(Tfz), K, A, C, Rl, O, Neg, I, z(_,Z))\n" +
"--> s(wy19), fzd(Tfz, K, A1, C1, T1, Neg1, I, _),\n" +
"	przec,\n" +
"	{ rowne(Tfz, ['aż1','czy','jak','jakby','jakoby',\n" +
"	              'mie1','mie2','mie3','pz','że','żeby']), \n" +
"        rozne(K, [bier,bp]),\n" +
"	Z = [p,np,pz,co,jaki,kto,'który'] }",
"fl(A, C, Rl, O, Neg, I, Z) --> s(lu1),\n" +
"	fl1(A, C, Rl, O, Neg, I, Z)",
"fl(A, C, Rl, O, Neg, I, z(_,[p])) --> s(lu2),\n" +
"	fl1(A, C, Rl, O, Neg, I, z(SwZ1,Z1)),\n" +
"	fl(A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	{ zplubnp(Z1,Z2,SwZ1,SwZ2) }",
"fl(A, C, Rl, O, Neg, I, z(SwZ,NZ)) --> s(lu3),\n" +
"	fl1(A, C, Rl, O, Neg, I, z(SwZ,Z)),\n" +
"	{ zrowne( Z, [pz], NZ ) },\n" +
"	fl(A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	{ zrowne( Z1, ['p','np'], SwZ1 ) }",
"fl(A, C, Rl, O, Neg, I, z(SwZ,NZ)) --> s(lu4),\n" +
"	fl1(A, C, Rl, O, Neg, I, z(SwZ,Z)), \n" +
"	{ zrozne(Z, ['p','pz'], NZ) },\n" +
"	fl(A, C, Rl, O, Neg, ni, z(SwZ1,Z1)),\n" +
"	{ zrowne(Z1, [np], SwZ1) }",
"fl1(A, C, Rl, O, Neg, I, z(SwZ,NZ))\n" +
"--> s(lu5), fpm(Pm, P, Neg, I, z(SwZ,Z), Kl), \n" +
"	{ zrozne(Z, ['byxx','choćby','czyżby',\n" +
"	             'gdyby','jakby','jakoby','żeby'], NZ) }",
"fl1(A, C, Rl, O, Neg, I, z(SwZ,NZ))\n" +
"--> s(lu6), fno(P, Rl1, O1, Neg, I, z(SwZ,Z), Kl, _), \n" +
"	{ rozne(P, [mian,wol]), \n" +
"          zrozne(Z, ['byxx','choćby','czyżby',\n" +
"	             'gdyby','jakby','jakoby','żeby'], NZ) }",
"fl1(A, C, Rl, O, Neg, I, z(SwZ,NZ))\n" +
"--> s(lu7), fps(St, Neg, I, z(SwZ,Z), Kl, _),\n" +
"	{ zrozne(Z, ['byxx','choćby','czyżby',\n" +
"	             'gdyby','jakby','jakoby','żeby'], NZ) }",
"fl1(A, C, Rl, O, Neg, I, z(_,Z))\n" +
"--> s(lu8), agl(Rl, O, I), \n" +
"	{ Z = ['byxx','choćby','czyżby','gdyby','jakby','jakoby','żeby']}",
"fl1(A, C, Rl, O, Neg, I, z(SwZ,NZ))\n" +
"--> s(lu9), przec, \n" +
"	fwe(psw, A1, C, T1, Rl1, O1, wym([],_), K, Neg, I, z(SwZ,Z)),\n" +
"	{ zrowne( Z, [np], NZ ) },\n" +
"	przec",
"fl1(A, C, Rl, O, Neg, I, z(SwZ,NZ))\n" +
"--> s(lu10), przec, \n" +
"	fwe(psu, A1, prze, T1, Rl1, O1, wym([],_), K, Neg, I, z(SwZ,Z)),\n" +
"	{ zrowne( Z, [np], NZ ) },\n" +
"	przec",
"fl1(A, przy, Rl, O, Neg, I, z(SwZ,NZ))\n" +
"--> s(lu11), przec, \n" +
"	fwe(psu, A1, C, T1, Rl1, O1, wym([],_), K, Neg, I, z(SwZ,Z)),\n" +
"	{ zrowne( Z, [np], NZ ) },\n" +
"	przec",
"fl1(A, C, Rl, 2, Neg, ni, z(SwZ,NZ))\n" +
"--> s(lu12), przec, \n" +
"	fno(wol, Rl, _O1, Neg1, ni, z(SwZ,Z), Kl, _),\n" +
"	{ zrowne( Z, [np], NZ ) },\n" +
"	przec",
"fl1(A, C, Rl, O, Neg, ni, z(SwZ,NZ))\n" +
"--> s(lu13), przec, \n" +
"	fno(wol, Rl1, _O1, Neg1, ni, z(SwZ,Z), Kl, _),\n" +
"	{ zrowne( Z, [np], NZ ) },\n" +
"	przec,\n" +
"	{ rowne(O, [1,3])}",
"fl1(nd, C, Rl, O, tak, I, z(_,[np]))\n" +
"     --> s(lu15), fzd('dopóki', nk, A1, C, T1, Neg1, I, _),\n" +
"       przec",
"fl1(A, C, Rl, O, nie(nie), I, z(_,[np]))\n" +
"     --> s(lu16), fzd('dopóki', nk, A1, C, T1, Neg1, I, _),\n" +
"       przec",
"fl1(A, C, Rl, O, Neg, I, z(_,[np]))\n" +
"     --> s(lu17), fzd(Tfz, nk, A1, C1, T1, Neg1, I, _),\n" +
"       przec,\n" +
"       { rowne(Tfz, ['choćby','gdyby']), \n" +
"        rozne(C, prze)}",
"fl1(A, C, Rl, O, Neg, I, z(_,[np]))\n" +
"     --> s(lu18), fzd(Tfz, nk, A1, C, T1, Neg1, I, _),\n" +
"       przec,\n" +
"       { rowne(Tfz, ['aż2','gdy','zanim'])}",
"fl1(A, C, Rl, O, Neg, I, z(_,[np]))\n" +
"     --> s(lu19), fzd(Tfz, nk, A1, C1, T1, Neg1, I, _),\n" +
"	przec,\n" +
"	{ rowne(Tfz,['bo','co','chociaż','czy','jak','jeśli',\n" +
"	            'podczas','ponieważ'])}",
"fwe(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,NZ))\n" +
"     --> s(we1), kweneg(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,Z)),\n" +
"	{ rowne(Wf, [bok,psu,psw]),\n" +
"	  zrowne(Z, [pz,co,jaki,kto,'który'], NZ) }",
"fwe(Wf, A, C, T, Rl, O, wym(_,ResztaWym), K, Neg, I, z(SwZ,NZ))\n" +
"--> s(we2/4/6), kweneg(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,Z)),\n" +
"	{ rowne(Wf, [bok,psu,psw]),\n" +
"	  zrowne( Z, ['p','px','pxx'], NZ ) },\n" +
"	wymagane( Wym, ResztaWym,\n" +
"	          [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)), \n" +
"		   W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"		   W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"       { resztawym(ResztaWym),\n" +
"	 zrowne(Z1, ['p','np'], SwZ1 ),\n" +
"         zrowne(Z2, ['p','np'], SwZ2 ), \n" +
"         zrowne(Z3, ['p','np'], SwZ3 )}",
"fwe(Wf, A, C, T, Rl, O, wym(_,ResztaWym), K, Neg, I, z(SwZ,NZ))\n" +
"--> s(we3/5/7),  fw(W1, K, A, C, Rl, O, Neg, I, z(SwZ1,Z1)),\n" +
"	{ zrowne(Z1, ['p','np'], SwZ1) },\n" +
"	wymagania([W1],  Wym, ResztaWym,\n" +
"	    kweneg(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,Z)),\n" +
"	    [W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"        { rowne(Wf, [bok,psu,psw]),\n" +
"	  resztawym(ResztaWym),\n" +
"	  zrowne(Z, ['p','px','pxx'], NZ ), \n" +
"          zrowne(Z2, ['p','np'], SwZ2 ), \n" +
"          zrowne(Z3, ['p','np'], SwZ3 ) }",
"fwe(Wf, A, C, T, Rl, O, wym(_,ResztaWym), K, Neg, I, z(SwZ,NZ))\n" +
"--> s(we8/10/12), kweneg(Wf, A, C, T, Rl, O, Wym, K, Neg, I, z(SwZ,Z)),\n" +
"	{ rowne(Wf, [bok,psu,psw]),\n" +
"	  zrozne( Z, ['co','jaki','kto','który','p','px','pxx','pz'], NZ ) },\n" +
"	wymagane( Wym, ResztaWym,\n" +
"	          [W1/fw(W1, K, A, C, Rl, O, Neg, ni, z(SwZ1,Z1)), \n" +
"		   W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"		   W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"       { resztawym(ResztaWym),\n" +
"	 zrowne(Z1, [np], SwZ1 ),\n" +
"         zrowne(Z2, [np], SwZ2 ), \n" +
"         zrowne(Z3, [np], SwZ3 )}",
"fwe(Wf, A, C, T, Rl, O, wym(_,ResztaWym), K, Neg, I, z(SwZ,NZ))\n" +
"--> s(we9/11/13),  fw(W1, K, A, C, Rl, O, Neg, I, z(SwZ1,Z1)),\n" +
"	{ zrowne(Z1, [np], SwZ1) },\n" +
"	wymagania([W1],  Wym, ResztaWym,\n" +
"	    kweneg(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,Z)),\n" +
"	    [W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"        { rowne(Wf, [bok,psu,psw]),\n" +
"	  resztawym(ResztaWym),\n" +
"	  zrowne(Z, ['co','jaki','kto','który','p','px','pxx','pz'], NZ ), \n" +
"          zrowne(Z2, [np], SwZ2 ), \n" +
"          zrowne(Z3, [np], SwZ3 ) }",
"fwe(Wf, A, C, T, Rl, O, wym(_,ResztaWym), K, Neg, I, z(SwZ,NZ))\n" +
"--> s(we14/15/16),  fw(W1, K, A, C, Rl, O, Neg, I, z(SwZ,Z1)),\n" +
"	{ zrowne(Z1, [pz], NZ1) },\n" +
"	wymagania([W1],  Wym, ResztaWym,\n" +
"	    kweneg(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,Z)),\n" +
"	    [W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"        { rowne(Wf, [bok,psu,psw]),\n" +
"	  resztawym(ResztaWym),\n" +
"	  zrowne(Z, NZ1, NZ ), \n" +
"          zrowne(Z2, ['p','np'], SwZ2 ), \n" +
"          zrowne(Z3, ['p','np'], SwZ3 ) }",
"fwe(Wf, A, C, T, Rl, O, wym(_,ResztaWym), K, Neg, I, z(SwZ,NZ))\n" +
"--> s(we17/18/19),  fw(W1, K, A, C, Rl, O, Neg, I, z(SwZ,Z1)),\n" +
"	{ zrowne(Z1, ['co','jaki','kto','który'], NZ1) },\n" +
"	wymagania([W1],  Wym, ResztaWym,\n" +
"	    kweneg(Wf, A, C, T, Rl, O, Wym, K, Neg, ni, z(SwZ,Z)),\n" +
"	    [W2/fw(W2, K, A, C, Rl, O, Neg, ni, z(SwZ2,Z2)),\n" +
"	     W3/fw(W3, K, A, C, Rl, O, Neg, ni, z(SwZ3,Z3))] ),\n" +
"        { rowne(Wf, [bok,psu,psw]),\n" +
"	  resztawym(ResztaWym),\n" +
"	  zrowne(Z, NZ1, NZ ), \n" +
"          zrowne(Z2, [np], SwZ2 ), \n" +
"          zrowne(Z3, [np], SwZ3 ) }",
"kweneg(Wf, A, C, T, Rl, O, Wym, K, nie(nie), I, z(SwZ,NZ))\n" +
"--> s(we20), partykula(nie), \n" +
"	kweink(Wf, A, C, T, Rl, O, Wym, K, I, z(SwZ,Z)),\n" +
"	{ rowne(Wf, [bok,psu,psw]),\n" +
"	  zrowne( Z, ['p','px','pxx','pz'], NZ ) },\n" +
"	fl(A, C, Rl, O, nie(nie), ni, z(SwZ1,Z1)),\n" +
"	{ zrozne(Z1, [pz], NZ1),\n" +
"	  zrowne(NZ1, [np|NZ], SwZ1) }",
"kweneg(Wf, A, C, T, Rl, O, Wym, K, nie(_), I, z(SwZ,NZ))\n" +
"--> s(we21), partykula(nie), \n" +
"	kweink(Wf, A, C, T, Rl, O, Wym, K, I, z(SwZ,Z)),\n" +
"	{ rowne(Wf, [bok,psu,psw]),\n" +
"	  zrozne( Z, ['p','px','pxx','pz'], NZ )},\n" +
"	fl(A, C, Rl, O, nie(nie), ni, z(SwZ1,Z1)),\n" +
"	{ zrowne( Z1, [np], SwZ1 ) }",
"kweneg(Wf, A, C, T, Rl, O, Wym, K, tak, I, z(SwZ,NZ))\n" +
"--> s(we22), kweink(Wf, A, C, T, Rl, O, Wym, K, I, z(SwZ,Z)), \n" +
"	{ rowne(Wf, [bok,psu,psw]),\n" +
"	  zrowne(Z, ['p','px','pxx','pz'], NZ) },\n" +
"	fl(A, C, Rl, O, tak, ni, z(SwZ1,Z1)),\n" +
"	{ zrozne( Z1, [pz], NZ1 ),\n" +
"          zrowne( NZ1, [np|NZ], SwZ1) }",
"kweneg(Wf, A, C, T, Rl, O, Wym, K, tak, I, z(SwZ,NZ))\n" +
"     --> s(we23), kweink(Wf, A, C, T, Rl, O, Wym, K, I, z(SwZ,Z)),\n" +
"	{ rowne(Wf, [bok,psu,psw]),\n" +
"	  zrozne( Z, ['aż1xx','boxx','byxx','dopóki',\n" +
"	'gdyxx',p,'px','pxx','pz','zanimxx'], NZ ) },\n" +
"	fl(A, C, Rl, O, tak, ni, z(SwZ1, Z1)),\n" +
"	{ zrowne(Z1, [np], SwZ1 )}",
"kweneg(Wf, nd, C, T, Rl, O, Wym, K, tak, I, z(SwZ,NZ))\n" +
"--> s(we24), kweink(Wf, A, C, T, Rl, O, Wym, K, I, z(SwZ,Z)), \n" +
"	{ rowne(Wf, [bok,psu,psw]),\n" +
"	  zrowne( Z, ['aż1xx','boxx','byxx',\n" +
"	              'dopóki','gdyxx','zanimxx'], NZ ) },\n" +
"	fl(A, C, Rl, O, tak, ni, z(SwZ1,Z1)),\n" +
"	{ zrowne( Z1, [np], SwZ1 ) }",
"kweneg(Wf, A, C, T, Rl, O, Wym, K, nie(nie), I, z(SwZ,NZ))\n" +
"--> s(we20e), partykula(nie), \n" +
"	kweink(Wf, A, C, T, Rl, O, Wym, K, I, z(SwZ,Z)),\n" +
"	{ zrowne( Z, ['p','px','pxx','pz'], NZ ) }",
"kweneg(Wf, A, C, T, Rl, O, Wym, K, nie(_), I, z(SwZ,NZ))\n" +
"--> s(we21e), partykula(nie),\n" +
"	kweink(Wf, A, C, T, Rl, O, Wym, K, I, z(SwZ,Z)),\n" +
"       { zrozne( Z, ['p','px','pxx','pz'], NZ ) }",
"kweneg(Wf, A, C, T, Rl, O, Wym, K, tak, I, z(SwZ,NZ))\n" +
"--> s(we22e), kweink(Wf, A, C, T, Rl, O, Wym, K, I, z(SwZ,Z)), \n" +
"	{ zrozne( Z, ['aż1xx','boxx','byxx','dopóki','gdyxx','zanimxx'], NZ) }",
"kweneg(Wf, nd, C, T, Rl, O, Wym, K, tak, I, z(SwZ,NZ))\n" +
"--> s(we24e), kweink(Wf, A, C, T, Rl, O, Wym, K, I, z(SwZ,Z)), \n" +
"	{ zrowne(Z, ['aż1xx','boxx','byxx','dopóki','gdyxx','zanimxx'], NZ) }",
"kweink(Wf, A, C, T, Rl, O, Wym, K, I, Z)\n" +
"--> s(we25), kwer(Wf, A, C, T, Rl, O, Wym, K, Z), \n" +
"	spoj(Tsp, I, ni),\n" +
"	{ rowne(I, ['bowiem','natomiast','więc','zaś']),\n" +
"	  rowne(Tsp, [pi,ri]) }",
"kweink(Wf, A, C, T, Rl, O, Wym, K, ni, Z)\n" +
"     --> s(we26), kwer(Wf, A, C, T, Rl, O, Wym, K, Z)",
"kwer(bos, A, prze, T, Rl, 3, Wym, K, Z)\n" +
"     --> s(we27), kwer1(bos, A, prze, T, Rl, 3, Wym, K, Z)",
"kwer(Wf, A, C, T, Rl, 3, Wym, K, Z)\n" +
"     --> s(we28), kwer1(Wf, A, C, T, Rl, 3, Wym, K, Z),\n" +
"       { rowne(Wf, ['bok','psu','psw']) }",
"kwer(os, A, C, T, Rl, O, Wym, K, Z)\n" +
"     --> s(we29), kwer1(os, A, C, T, Rl, O, Wym, K, Z)",
"kwer1(Wf, A, C, T, Rl, O, Wym, K, z(_,['np','npx','npxx'| Z1]))\n" +
"     --> s(we30n), \n" +
"	formaczas(Wf, A, C, T, Rl, O, Wym, K ),\n" +
"	{ (T \== roz\n" +
"    ->\n" +
"	Z1 = ['npt','npxt','npxxt','p','px','pxx','pz'| Z2]\n" +
"    ;\n" +
"	Z1 = Z2 ),\n" +
"	( T \== roz, Wf \== bok\n" +
"    ->\n" +
"	Z2 = ['aż1xx','aż2','bo','box','boxx','bowiem','chociaż', \n" +
"	       'co','czy','dopóki','gdy','gdyxx',\n" +
"	       'jak','jaki','jeśli','kto','który',\n" +
"	       'podczas','ponieważ','że'| Z3]\n" +
"    ;\n" +
"	Z2 = Z3 ),\n" +
"	( T \== roz, Wf \== bok, C == przy\n" +
"    ->\n" +
"	Z3 = ['aż1'| Z4]\n" +
"    ;\n" +
"	Z3 = Z4),\n" +
"	( T \== roz, Wf \== bok, A == dk\n" +
"    ->\n" +
"	Z4 = [zanim, zanimxx | Z5]\n" +
"    ;\n" +
"	Z4 = Z5 ),\n" +
"	( Wf \== bok, C == prze, T == ozn\n" +
"    ->\n" +
"	Z5 = ['byxx','choćby','czyżby','gdyby','jakby','jakoby','żeby']\n" +
"    ;\n" +
"	Z5 = [])\n" +
"	}",
"kwer1(bok, A, prze, ozn, Rl, O, Wym, K,\n" +
"	z(_,['byxx','choćby','czyżby','gdyby','jakby','jakoby','żeby']))\n" +
"     --> s(we35n),\n" +
"	formaczas(bok, A, prze, ozn, Rl, O, Wym, K )",
"fpm(Pm, P, Neg, I, Z, Kl) --> s(pm1),\n" +
"	przyimek(Pm, P), \n" +
"	fno(P, Rl, O, Neg, I, Z, Kl, _)",
"fno(P, Rl, O, Neg, I, Z, Kl, X)\n" +
"--> s(no1),\n" +
"	knodop(P, Rl, O, Neg, I, Z, Kl, @X)",
"fno(P, Rl, O, Neg, I, Z, Kl, @ @ @ @ @0)\n" +
"--> s(no2),\n" +
"	knodop(P, Rl, O, Neg, I, Z, Kl, _),\n" +
"	{ rozne(Kl, ['co','kto','wz']) },\n" +
"	fzd('który', nk, A, C, T, Neg1, Rl, _),\n" +
"	przec",
"fno(P, Rl, O, Neg, I, Z, Kl, @ @ @ @ @0)\n" +
"--> s(no3), knodop(P, Rl, O, Neg, I, Z, Kl, _), \n" +
"	{ rowne(Kl, ['co','kto']) },\n" +
"	fzd(Tfz, nk, A, C, T, Neg1, Rl, _),\n" +
"	{ rowne(Tfz, [Kl, 'który'])},\n" +
"	przec",
"fno(P, Rl, O, Neg, I, Z, tk, @ @ @ @ @0)\n" +
"--> s(no4), knodop(P, Rl, O, Neg, I, Z, tk, _), \n" +
"	fzd(Tfz, nk, A, C, T, Neg1, ni, _),\n" +
"	{ rowne(Tfz, ['jakby','jaki','że','żeby'])},\n" +
"	przec",
"knodop(P, Rl, O, Neg, I, Z, Kl, X)\n" +
"--> s(no5), knopm(P, Rl, O, Neg, I, Z, Kl, @X)",
"knodop(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no6), knopm(P, Rl, O, Neg, I, z(SwZ,Z), Kl2, _), \n" +
"	{ rozne(Kl2, os) },\n" +
"	fno(dop, Rl1, 3, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"          rozne(Kl1, kto),\n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"knodop(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no7), fno(dop, Rl1, 3, Neg1, I, z(SwZ1,Z1), Kl1, _), \n" +
"        { rozne(Kl1, kto) },\n" +
"	knopm(P, Rl, O, Neg, ni, z(SwZ,Z), Kl2, _),\n" +
"	{ zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"	  rozne(Kl2, os), \n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"knodop(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no8), knopm(P, Rl, O, Neg, I, z(SwZ,Z), Kl2, _), \n" +
"	{ zrowne(Z, ['co','jaki','który','np'], NZ ), \n" +
"	  rozne(Kl2, ['os','wz']) },\n" +
"	fno(dop, Rl1, 3, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne( Z1, [np], SwZ1 ),\n" +
"          rozne(Kl1, kto), \n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"knodop(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no9), fno(dop, Rl1, 3, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne( Z, ['co','jaki','który','np'], NZ ), \n" +
"          rozne(Kl1, kto) },\n" +
"	knopm(P, Rl, O, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne( Z1, [np], SwZ1 ),\n" +
"          rozne(Kl2, os), \n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"knodop(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no10), knopm(P, Rl, O, Neg, I, z(SwZ,Z), Kl2, _), \n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	fno(dop, Rl1, 3, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"        rozne(Kl1, kto), \n" +
"        oblkl(Kl, Kl1, Kl2)}",
"knodop(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"     --> s(no11), fno(dop, Rl1, 3, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ rozne(Kl1, kto), \n" +
"	  zrowne(Z, [pz], NZ) },\n" +
"	knopm(P, Rl, O, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"          rozne(Kl2, os), \n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"knopm(P, Rl, O, Neg, I, Z, Kl, X)\n" +
"--> s(no12), knoatr(P, Rl, O, Neg, I, Z, Kl, @X)",
"knopm(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no13), knoatr(P, Rl, O, Neg, I, z(SwZ,Z), Kl2, _), \n" +
"	fpm(Pm, P1, Neg1, ni, z(SwZ1,Z1), Kl1),\n" +
"	{ zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knopm(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no14), fpm(Pm, P1, Neg1, I, z(SwZ1,Z1), Kl1), \n" +
"	knoatr(P, Rl, O, Neg, ni, z(SwZ,Z), Kl2, _),\n" +
"	{ zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knopm(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no15), knoatr(P, Rl, O, Neg, I, z(SwZ,Z), Kl2, _), \n" +
"	{ zrowne(Z, ['co','jaki','który','np'], NZ) },\n" +
"	fpm(Pm, P1, Neg1, ni, z(SwZ1,Z1), Kl1),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knopm(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no16), fpm(Pm, P1, Neg1, I, z(SwZ,Z), Kl1),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ) },\n" +
"	knoatr(P, Rl, O, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knopm(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no17), knoatr(P, Rl, O, Neg, I, z(SwZ,Z), Kl2, _), \n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	fpm(Pm, P1, Neg1, ni, z(SwZ1,Z1), Kl1),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knopm(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no18), fpm(Pm, P1, Neg1, I, z(SwZ,Z), Kl1), \n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	knoatr(P, Rl, O, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, Z, Kl, X)\n" +
"     --> s(no19), knoink(P, Rl, O, Neg, I, Z, Kl, @X)",
"knoatr(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no20), knoink(P, Rl, O, Neg, I, z(SwZ,Z), Kl2, _), \n" +
"	fpt(P, Rl, St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"          rozne(Kl2, co), \n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"knoatr(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no21), knoink(P, Rl, O, Neg, I, z(SwZ,Z), co, _), \n" +
"	{ rowne(P, ['mian','bier']) },\n" +
"	fpt(dop, Rl, St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"        oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no22), knoink(P, Rl, O, Neg, I, z(SwZ,Z), co, _), \n" +
"	{ rozne(P, ['mian','bier']) },\n" +
"	fpt(P, Rl, St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"        oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no23), fpt(P, Rl, St1, Neg1, I, z(SwZ1,Z1), Kl1, _),\n" +
"	knoink(P, Rl, O, Neg, ni, z(SwZ,Z), Kl2, _),\n" +
"	{ zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"          rozne(Kl2, co), \n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no24), fpt(dop, Rl, St1, Neg1, I, z(SwZ1,Z1), Kl1, _),\n" +
"	knoink(P, Rl, O, Neg, ni, z(SwZ,Z), co, _),\n" +
"	{ rowne(P, ['mian','bier']), \n" +
"	  zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(no25), fpt(P, Rl, St1, Neg1, I, z(SwZ1,Z1), Kl1, _),\n" +
"	knoink(P, Rl, O, Neg, ni, z(SwZ,Z), co, _),\n" +
"	{ rozne(P, ['mian','bier']),\n" +
"	  zplubnp(Z,Z1,SwZ,SwZ1),\n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no26), knoink(P, Rl, O, Neg, I, z(SwZ,Z), Kl2, _), \n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ), \n" +
"          rozne(Kl2, ['co','os','wz']) },\n" +
"	fpt(P, Rl, St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2) }",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no27), fpt(P, Rl, St1, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ) },\n" +
"	knoink(P, Rl, O, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          rozne(Kl2, ['co','os','wz']), \n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no28), knoink(P, Rl, O, Neg, I, z(SwZ,Z), co, _), \n" +
"	{ rowne(P, ['mian','bier']), \n" +
"	  zrowne(Z, [np], NZ) },\n" +
"	fpt(dop, Rl, St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no29), knoink(P, Rl, O, Neg, I, z(SwZ,Z), co, _), \n" +
"	{ rozne(P, ['mian','bier']), \n" +
"	  zrowne(Z, [np], NZ) },\n" +
"	fpt(P, Rl, St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no30), fpt(dop, Rl, St1, Neg1, I, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, [np], SwZ1) },\n" +
"	knoink(P, Rl, O, Neg, ni, z(SwZ,Z), co, _),\n" +
"	{ rowne(P, ['mian','bier']), \n" +
"	  zrowne(Z, [np], NZ),\n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no31), fpt(P, Rl, St1, Neg1, I, z(SwZ1,Z1), Kl1, _),\n" +
"	{ rozne(P, ['mian','bier']), \n" +
"	  zrowne(Z1, [np], SwZ1) },\n" +
"	knoink(P, Rl, O, Neg, ni, z(SwZ,Z), co, _),\n" +
"	{ zrowne(Z, [np], NZ),\n" +
"          oblkl(Kl, Kl1, Kl2) }",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no32), knoink(P, Rl, O, Neg, I, z(SwZ,Z), Kl2, _), \n" +
"	{ rozne(Kl2, [co]),\n" +
"	  zrowne(Z, [pz], NZ) },\n" +
"	fpt(P, Rl, St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no33), knoink(P, Rl, O, Neg, I, z(SwZ,Z), co, _), \n" +
"	{ rowne(P, ['mian','bier']),\n" +
"	  zrowne(Z, [pz], NZ) },\n" +
"	fpt(dop, Rl, St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no34), knoink(P, Rl, O, Neg, I, z(SwZ,Z), co, _), \n" +
"	{ rozne(P, ['mian','bier']),\n" +
"	  zrowne(Z, [pz], NZ) },\n" +
"	fpt(P, Rl, St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"          oblkl(Kl, Kl1, Kl2)}",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no35), fpt(P, Rl, St1, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	knoink(P, Rl, O, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ rozne(Kl2, co), \n" +
"          zrowne(Z1, ['np','p'], SwZ1), \n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no36), fpt(dop, Rl, St1, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	knoink(P, Rl, O, Neg, ni, z(SwZ1,Z1), co, _),\n" +
"	{ rowne(P, ['mian','bier']),\n" +
"	  zrowne(Z1, ['np','p'], SwZ1), \n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"knoatr(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(no37), fpt(P, Rl, St1, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, [pz], NZ),\n" +
"	  rozne(P, ['mian','bier']) },\n" +
"        knoink(P, Rl, O, Neg, ni, z(SwZ1,Z1), co, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"          oblkl(Kl, Kl1, Kl2) }",
"knoatr(P, Rl, 3, Neg, I, Z, Kl, @ @ @ @ @0)\n" +
"     --> s(no38), fpt(P, Rl, St, Neg, I, Z, Kl, _)",
"knoink(P, Rl, O, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0) --> s(no39),\n" +
"	knom(P, Rl, O, Neg, z(SwZ,Z), Kl, _),\n" +
"	{ zrowne(Z, ['np','p','pz'], NZ) },\n" +
"	spoj(Tsp, I, ni),\n" +
"	{ rowne(I, ['bowiem','natomiast','więc','zaś']),\n" +
"  	  rowne(Tsp, [pi,ri]) }",
"knoink(P, Rl, O, Neg, ni, z(SwZ,NZ), Kl, X) --> s(no40), \n" +
"	knom(P, Rl, O, Neg, z(SwZ,Z), Kl, @X), \n" +
"	{ zrowne( Z, ['np','p','pz'], NZ ) }",
"knoink(P, Rl, O, Neg, Rl, z(SwZ,NZ), Kl, X) --> s(no41), \n" +
"	knom(P, Rl, O, Neg, z(SwZ,Z), Kl, @X), \n" +
"	{ rozne(I, ['bowiem','natomiast','ni','więc','zaś']),\n" +
"        zrowne( Z, ['co','jaki','kto','który'], NZ ) }",
"knom(P, Rl, 3, Neg, z(_,Z), Kl, @ @ @ @ @ 0)\n" +
"--> s(no42), zaimpyt(rzecz, P, Rl, 3, Kl), \n" +
"	{ Z = [p,pz], \n" +
"          rowne(Kl, ['co','kto'])}",
"knom(P, Rl, 3, Neg, z(_,[np]), Kl, @ @ @ @ @ 0)\n" +
"--> s(no43), zaimno(rzecz, P, Rl, 3, Kl), \n" +
"	{ rowne(Kl, ['co','kto'])}",
"knom(P, Rl, 3, nie(_), z(_,[np]), Kl, @ @ @ @ @ 0)\n" +
"--> s(no44), zaimneg(rzecz, P, Rl, 3, Kl),\n" +
"	{ rowne(Kl, ['co','kto'])}",
"knom(P, Rl, O, _Neg, z(_,[np]), os, @ @ @ @ @ 0) --> s(no45),\n" +
"	zaimos( P, Rl, O )",
"knom(P, Rl, 3, Neg, z(_,[np]), rzecz, @ @ @ @ @ 0)\n" +
"--> s(no46), formarzecz(P, Rl)",
"knom(P, Rl, 3, Neg, z(_,[Kl]), wz, @ @ @ @ @ 0)\n" +
"--> s(no47), zaimwzg(rzecz, P, Rl, 3, Kl),\n" +
"	{ rowne( Kl, ['co','kto','który']) }",
"knom(P, Rl, O, Neg, Z, Kl, X)\n" +
"--> s(no48), fno(P, Rl, O, Neg, ni, Z, Kl, @X)",
"fpt(P, Rl, St, Neg, I, Z, Kl, X)\n" +
"     --> s(pt1), kptno(P, Rl, St, Neg, I, Z, Kl, @X)",
"fpt(P, Rl, St, Neg, I, Z, tk, @ @ @ @ @0)\n" +
"     --> s(pt2), kptno(P, Rl, St, Neg, I, Z, tk, _),\n" +
"       fzd(Tfz, nk, A, C, T, Neg1, ni, _),\n" +
"       przec,\n" +
"       { rowne(Tfz, ['jakby','jaki','że','żeby'])}",
"kptno(P, Rl, St, Neg, I, Z, Kl, X)\n" +
"     --> s(pt3), kptpm(P, Rl, St, Neg, I, Z, Kl, @X)",
"kptno(P, Rl, St, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"     --> s(pt4), kptpm(P, Rl, St, Neg, I, z(SwZ1,Z1), Kl2, _),\n" +
"       fno(P1, Rl1, O, Neg1, ni, z(SwZ2,Z2), Kl1, _),\n" +
"       { zplubnp( Z1, Z2, SwZ1, SwZ2 ),\n" +
"         oblkl(Kl, Kl1, Kl2)}",
"kptno(P, Rl, St, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(pt5), fno(P1, Rl1, O, Neg1, I, z(SwZ1,Z1), Kl1, _), \n" +
"	kptpm(P, Rl, St, Neg, ni, z(SwZ2,Z2), Kl2, _),\n" +
"	{ zplubnp( Z1, Z2, SwZ1, SwZ2 ),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"kptno(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt6), kptpm(P, Rl, St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ), \n" +
"          rozne(Kl2, wz) }, \n" +
"	fno(P1, Rl1, O, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"kptno(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt7), fno(P1, Rl1, O, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ) },\n" +
"	kptpm(P, Rl, St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"kptno(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt8), kptpm(P, Rl, St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	fno(P1, Rl1, O, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"          oblkl(Kl, Kl1, Kl2)}",
"kptno(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt9), fno(P1, Rl1, O, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	kptpm(P, Rl, St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"          oblkl(Kl, Kl1, Kl2)}",
"kptpm(P, Rl, St, Neg, I, Z, Kl, X)\n" +
"     --> s(pt10), kptps(P, Rl, St, Neg, I, Z, Kl, @X)",
"kptpm(P, Rl, St, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(pt11), kptps(P, Rl, St, Neg, I, Z1, Kl2, _),\n" +
"	fpm(Pm, P1, Neg1, ni, Z2, Kl1),\n" +
"	{ zplubnp( Z1, Z2, SwZ1, SwZ2 ),\n" +
"          oblkl(Kl, Kl1, Kl2) }",
"kptpm(P, Rl, St, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(pt12), fpm(Pm, P1, Neg1, I, Z1, Kl1), \n" +
"	kptps(P, Rl, St, Neg, ni, Z2, Kl2, _),\n" +
"	{ zplubnp( Z1, Z2, SwZ1, SwZ2 ),\n" +
"          oblkl(Kl, Kl1, Kl2) }",
"kptpm(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt13), kptps(P, Rl, St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ) },\n" +
"	fpm(Pm, P1, Neg1, ni, z(SwZ1,Z1), Kl1),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"kptpm(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt14), fpm(Pm, P1, Neg1, I, z(SwZ,Z), Kl1),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ) },\n" +
"	kptps(P, Rl, St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"kptpm(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt15), kptps(P, Rl, St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne(Z,[pz],NZ) },\n" +
"	fpm(Pm, P1, Neg1, ni, z(SwZ1,Z1), Kl1),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"kptpm(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt16), fpm(Pm, P1, Neg1, I, z(SwZ,Z), Kl1), \n" +
"	{ zrowne(Z,[pz],NZ) },\n" +
"	kptps(P, Rl, St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z, ['np','p'], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2) }",
"kptps(P, Rl, St, Neg, I, Z, Kl, X)\n" +
"     --> s(pt17), kptink(P, Rl, St, Neg, I, Z, Kl, @X)",
"kptps(P, Rl, St, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(pt18), kptink(P, Rl, St, Neg, I, Z1, Kl2, _),\n" +
"	fps(St1, Neg1, ni, Z2, Kl1, _),\n" +
"	{ zplubnp( Z1, Z2, SwZ1, SwZ2 ),\n" +
"          oblkl(Kl, Kl1, Kl2) }",
"kptps(P, Rl, St, Neg, I, z(_,[p]), Kl, @ @ @ @ @0)\n" +
"--> s(pt19), fps(St1, Neg1, I, Z1, Kl1, _),\n" +
"	kptink(P, Rl, St, Neg, ni, Z2, Kl2, _),\n" +
"	{ zplubnp( Z1, Z2, SwZ1, SwZ2 ),\n" +
"          oblkl(Kl, Kl1, Kl2) }",
"kptps(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt20), kptink(P, Rl, St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ) }, \n" +
"	fps(St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"kptps(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt21), fps(St1, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ) }, \n" +
"	kptink(P, Rl, St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2) }",
"kptps(P, Rl, St, Neg, I, z(_,[pz]), Kl, @ @ @ @ @0)\n" +
"--> s(pt22), kptink(P, Rl, St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], SwZ) },\n" +
"	fps(St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1),\n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"kptps(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt23), fps(St1, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	kptink(P, Rl, St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"          oblkl(Kl, Kl1, Kl2) }",
"kptink(P, Rl, St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @ @0)\n" +
"--> s(pt24), kprzym(P, Rl, St, Neg, z(SwZ,Z), Kl, _),\n" +
"        { zrozne(Z, [jaki], NZ) },\n" +
"	spoj(Tsp, I, ni),\n" +
"	{ rowne(I, ['bowiem','natomiast','więc','zaś']),\n" +
"	  rowne(Tsp, [pi,ri]) }",
"kptink(P, Rl, St, Neg, ni, z(SwZ,NZ), Kl, X)\n" +
"--> s(pt25), kprzym(P, Rl, St, Neg, z(SwZ,Z), Kl, @X),\n" +
"	{ zrozne(Z, [jaki], NZ)}",
"kptink(P, Rl, St, Neg, ni, z(SwZ,NZ), wz, X)\n" +
"--> s(pt26), kprzym(P, Rl, St, Neg, z(SwZ,Z), wz, @X),\n" +
"	{ zrowne(Z, [jaki], NZ) }",
"kprzym(P, Rl, row, Neg, z(_,[p,pz]), zaim, @ @ @ @ @0)\n" +
"     --> s(pt27), zaimpyt(przym, P, Rl, 3, zaim)",
"kprzym(P, Rl, row, Neg, z(_,[np]), Kl, @ @ @ @ @0)\n" +
"     --> s(pt28), zaimno(przym, P, Rl, O, Kl),\n" +
"       { rowne(Kl, ['tk','zaim'])}",
"kprzym(P, Rl, row, nie(_Neg), z(_,[np]), zaim, @ @ @ @ @0)\n" +
"     --> s(pt29), zaimneg(przym, P, Rl, 3, Kl)",
"kprzym(P, Rl, St, Neg, z(_,[np]), przym, @ @ @ @ @0)\n" +
"     --> s(pt30), formaprzym(P, Rl, St)",
"kprzym(P, Rl, row, Neg, z(_,[jaki]), wz, @ @ @ @ @0)\n" +
"     --> s(pt31), zaimwzg(przym, P, Rl, 3, wz)",
"kprzym(P, Rl, St, Neg, Z, Kl, X)\n" +
"     --> s(pt32), fpt(P, Rl, St, Neg, ni, Z, Kl, @X)",
"fps(St, Neg, I, Z, Kl, X)\n" +
"     --> s(ps1), kpspm(St, Neg, I, Z, Kl, @X)",
"fps(St, Neg, I, Z, Kl, @ @ @ @0)\n" +
"     --> s(ps2), kpspm(St, Neg, I, Z, Kl, _),\n" +
"       fzd(Tfz, nk, A, C, T, Neg1, ni, _),\n" +
"       przec,\n" +
"       { rowne(Tfz, ['jak','jakby','że','żeby'])}",
"kpspm(St, Neg, I, Z, Kl, X)\n" +
"     --> s(ps3), kpsps(St, Neg, I, Z, Kl, @X)",
"kpspm(St, Neg, I, z(_,[p]), Kl, @ @ @ @0)\n" +
"--> s(ps4), kpsps(St, Neg, I, z(SwZ1,Z1), Kl2, _),\n" +
"	fpm(Pm, P, Neg1, ni, z(SwZ2,Z2), Kl1),\n" +
"	{ zplubnp(Z1,Z2,SwZ1,SwZ2), \n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"kpspm(St, Neg, I, z(_,[p]), Kl, @ @ @ @0)\n" +
"--> s(ps5), fpm(Pm, P, Neg1, I, z(SwZ1,Z1), Kl1), \n" +
"	kpsps(St, Neg, ni, z(SwZ2,Z2), Kl2, _),\n" +
"	{ zplubnp(Z1,Z2,SwZ1,SwZ2),\n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"kpspm(St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @0)\n" +
"--> s(ps6), kpsps(St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne( Z, [co,jaki,kto,'który',np], NZ ) },\n" +
"	fpm(Pm, P, Neg1, ni, z(SwZ1,Z1), Kl1),\n" +
"	{ zrowne( Z1, [np], SwZ1 ),\n" +
"	oblkl(Kl, Kl1, Kl2) }",
"kpspm(St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @0)\n" +
"--> s(ps7), fpm(Pm, P, Neg1, I, z(SwZ,Z), Kl1),\n" +
"	{ zrozne( Z, [co,jaki,kto,'który',np], NZ ) },\n" +
"	kpsps(St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne( Z1, [np], SwZ1 ),\n" +
"	oblkl(Kl, Kl1, Kl2)}",
"kpspm(St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @0)\n" +
"--> s(ps8), kpsps(St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne( Z, [pz], NZ ) },\n" +
"	fpm(Pm, P, Neg1, ni, z(SwZ1,Z1), Kl1),\n" +
"	{ zrowne(Z1, [np,p], SwZ1 ),\n" +
"        oblkl(Kl, Kl1, Kl2)}",
"kpspm(St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @0)\n" +
"--> s(ps9), fpm(Pm, P, Neg1, I, z(SwZ,Z), Kl1), \n" +
"	{ zrowne( Z, [pz], NZ ) },\n" +
"	kpsps(St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1 ),\n" +
"        oblkl(Kl, Kl1, Kl2)}",
"kpsps(St, Neg, I, Z, Kl, X)\n" +
"     --> s(ps10), kpsink(St, Neg, I, Z, Kl, @X)",
"kpsps(St, Neg, I, z(_,[p]), Kl, @ @ @ @0)\n" +
"--> s(ps11), kpsink(St, Neg, I, z(SwZ1,Z1), Kl2, _),\n" +
"	fps(St1, Neg1, ni, z(SwZ2,Z2), Kl1, _),\n" +
"	{ zplubnp(Z1,Z2,SwZ1,SwZ2),\n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"kpsps(St, Neg, I, z(_,[p]), Kl, @ @ @ @0)\n" +
"--> s(ps12), fps(St1, Neg1, I, z(SwZ1,Z1), Kl1, _),\n" +
"	kpsink(St, Neg, ni, z(SwZ2,Z2), Kl2, _),\n" +
"	{ zplubnp(Z1,Z2,SwZ1,SwZ2),\n" +
"	  oblkl(Kl, Kl1, Kl2) }",
"kpsps(St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @0)\n" +
"--> s(ps13), kpsink(St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne( Z, ['co','jaki','kto','który','np'], NZ ) },\n" +
"	fps(St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne( Z1, [np], SwZ1 ),\n" +
"          oblkl(Kl, Kl1, Kl2)}",
"kpsps(St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @0)\n" +
"--> s(ps14), fps(St1, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','np'], NZ) },\n" +
"	kpsink(St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, [np], SwZ1),\n" +
"	  oblkl(Kl, Kl1, Kl2)}",
"kpsps(St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @0)\n" +
"--> s(ps15), kpsink(St, Neg, I, z(SwZ,Z), Kl2, _),\n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	fps(St1, Neg1, ni, z(SwZ1,Z1), Kl1, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"          oblkl(Kl, Kl1, Kl2)}",
"kpsps(St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @0)\n" +
"--> s(ps16), fps(St1, Neg1, I, z(SwZ,Z), Kl1, _),\n" +
"	{ zrowne(Z, [pz], NZ) },\n" +
"	kpsink(St, Neg, ni, z(SwZ1,Z1), Kl2, _),\n" +
"	{ zrowne(Z1, ['np','p'], SwZ1), \n" +
"        oblkl(Kl, Kl1, Kl2)}",
"kpsink(St, Neg, I, z(SwZ,NZ), Kl, @ @ @ @0) --> s(ps17),\n" +
"	kprzysl(St, Neg, z(SwZ,Z), Kl, _),\n" +
"	{ zrowne( Z, ['np','p','pz'], NZ ) },\n" +
"	spoj(Tsp, I, ni),\n" +
"	{ rowne(I, ['bowiem','natomiast','więc','zaś']),\n" +
"	  rowne(Tsp, [pi,ri])  }",
"kpsink(St, Neg, ni, z(SwZ,NZ), Kl, X)\n" +
"--> s(ps18), kprzysl(St, Neg, z(SwZ,Z), Kl, @X),\n" +
"	{ zrowne(Z, [np, p, pz], NZ) }",
"kprzysl(row, Neg, z(_,[p,pz]), Kl, @ @ @ @0)\n" +
"     --> s(ps19), zaimpyt(przysl, P, Rl, O, Kl)",
"kprzysl(row, Neg, z(_,[np]), Kl, @ @ @ @0)\n" +
"     --> s(ps20), zaimno(przysl, P, Rl, O, Kl)",
"kprzysl(row, nie(_Neg), z(_,[np]), Kl, @ @ @ @0)\n" +
"     --> s(ps21), zaimneg(przysl, P, Rl, O, Kl)",
"kprzysl(St, Neg, z(_,[np]), Kl, @ @ @ @0)\n" +
"     --> s(ps22), formaprzysl(St)",
"kprzysl(St, Neg, Z, Kl, X)\n" +
"     --> s(ps23), fps(St, Neg, ni, Z, Kl, @X)",
"fzd(Tfz, K, A, C, T, Neg, I, X)\n" +
"--> s(zd1), fzdsz(Tfz, K, A, C, T, Neg, I, @X)",
"fzd(Tfz, K, A, C, T, Neg0, I, @ @ @0)\n" +
"--> s(zd2), spoj(rl, Oz, I), \n" +
"	fzdsz(Tfz, K, A, C, T, Neg, ni, _),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']), \n" +
"          rozne(K, nk) },\n" +
"	przec,\n" +
"	spoj(rp, Oz, ni),\n" +
"	fzdsz(Tfz, K1, A1, C1, T1, Neg1, ni, _),\n" +
"        { rowne(K1, [K,'bp']) }",
"fzd(Tfz, K, A, C, T, Neg0, I, @ @ @0)\n" +
"--> s(zd3), fzdsz(Tfz, K, A, C, T, Neg0, I, _),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']) },\n" +
"	przec,\n" +
"	spoj(rc, Oz, ni),\n" +
"	fzdsz(Tfz, K1, A1, C1, T1, Neg1, ni, _),\n" +
"	{ rozne(K1, nk), \n" +
"          rowne(K1, [K,'bp'])}",
"fzd(Tfz, bp, A, C, T, Neg0, I, @ @ @0)\n" +
"--> s(zd4), spoj(rl, Oz, I), \n" +
"	fzdsz(Tfz, bp, A, C, T, Neg, ni, _),\n" +
"	{ rowne(Tfz, ['dopóki','zanim'])},\n" +
"	przec,\n" +
"	spoj(rp, Oz, ni),\n" +
"	fzdsz(Tfz, bp, A1, C, T, Neg1, ni, _)",
"fzd(Tfz, K, A, C, T, Neg0, I, @ @ @0)\n" +
"--> s(zd5), fzdsz(Tfz, K, A, C, T, Neg0, I, _),\n" +
"	{ rowne(Tfz, ['dopóki','zanim']) },\n" +
"	przec,\n" +
"	spoj(rc, Oz, ni),\n" +
"        { rowne(Oz, ['alei','nie']) },\n" +
"	fzdsz(Tfz, bp, A1, C, T, Neg1, ni, _)",
"fzd(Tfz, bp, A, C, T, Neg0, I, @ @ @0)\n" +
"--> s(zd6), spoj(rl, Oz, I), \n" +
"	fzdsz(Tfz, bp, A, C, T, Neg, ni, _),\n" +
"	{ rowne(Tfz, ['aż2','gdy'])},\n" +
"	przec,\n" +
"	spoj(rp, Oz, ni),\n" +
"	fzdsz(Tfz, bp, A1, C, T1, Neg1, ni, _)",
"fzd(Tfz, K, A, C, T, Neg0, I, @ @ @0)\n" +
"--> s(zd7), fzdsz(Tfz, K, A, C, T, Neg0, I, _),\n" +
"	{ rowne(Tfz, ['aż2','gdy']) }, \n" +
"	przec,\n" +
"	spoj(rc, Oz, ni), \n" +
"        { rowne(Oz, ['alei','nie']) },\n" +
"	fzdsz(Tfz, bp, A1, C, T1, Neg1, ni, _)",
"fzd(Tfz, bp, A, C, T, Neg0, I, @ @ @0)\n" +
"--> s(zd8), spoj(rl, Oz, ni), \n" +
"	fzdsz(Tfz, bp, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['co','jaki','kto','który'])},\n" +
"	przec,\n" +
"	spoj(rp, Oz, ni),\n" +
"	fzdsz(Tfz, bp, A1, C1, T1, Neg1, I, _)",
"fzd(Tfz, K, A, C, T, Neg0, I, @ @ @0)\n" +
"--> s(zd9), fzdsz(Tfz, K, A, C, T, Neg0, I, _),\n" +
"	{ rowne(Tfz, ['co','jaki','kto','który']) }, \n" +
"	przec,\n" +
"	spoj(rc, Oz, ni),\n" +
"        { rowne(Oz, ['alei','nie'])},\n" +
"	fzdsz(Tfz, bp, A1, C1, T1, Neg1, I, _)",
"fzdsz(Tfz, K, A, C, T, Neg, I, X)\n" +
"--> s(zd10), fzdj(Tfz, K, A, C, T, Neg, I, Oz, @X),\n" +
"	{ rozne(Oz, lub)}",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd11), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']), \n" +
"          rozne(K, ['nk','bp']) },\n" +
"	przec,\n" +
"	fzdj(Tfz, K, A1, C1, T1, Neg1, ni, Oz, _),\n" +
"        { rozne(Oz, ['ani','przec']) }",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd12), fzdj(Tfz, K, A, C, T, Neg, I, przec, _),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']), \n" +
"          rozne(K, ['nk','bp']) },\n" +
"	przec,\n" +
"	spoj(szk, Oz, ni),\n" +
"        { rozne(Oz, ani) },\n" +
"	fzdkor(Tfz, K, A1, C1, T1, Neg1, ni, _)",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd13), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']) }, \n" +
"	fzdj(Tfz, bp, A1, C1, T1, Neg1, ni, Oz, _),\n" +
"        { rozne(Oz, ['ani','przec']) }",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd14), fzdj(Tfz, K, A, C, T, Neg, I, przec, _),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']) },\n" +
"	spoj(szk, Oz, ni),\n" +
"        { rozne(Oz, ani) },\n" +
"	fzdkor(Tfz, bp, A1, C1, T1, Neg1, ni, _)",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd15), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['dopóki','zanim']) }, \n" +
"	fzdj(Tfz, bp, A1, C, T, Neg1, ni, Oz, _),\n" +
"        { rozne(Oz, ['ani','przec']) }",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd16), fzdj(Tfz, K, A, C, T, Neg, I, przec, _),\n" +
"	{ rowne(Tfz, ['dopóki','zanim']) },\n" +
"	fzdkor(Tfz, bp, A1, C1, T1, Neg1, I, _),\n" +
"        { rozne(Oz, ani) }",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd17), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['aż2','gdy']) },\n" +
"	fzdj(Tfz, bp, A1, C, T1, Neg1, ni, Oz, _),\n" +
"        { rozne(Oz, ['ani','przec']) }",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd18), fzdj(Tfz, K, A, C, T, Neg, I, przec, _),\n" +
"	{ rowne(Tfz, ['aż2','gdy']) },\n" +
"	fzdkor(Tfz, bp, A1, C1, T1, Neg1, I, _),\n" +
"        { rozne(Oz, ani) }",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd19), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['co','jaki','kto','który']) },\n" +
"	fzdj(Tfz, bp, A1, C1, T1, Neg1, I, Oz, _),\n" +
"        { rozne(Oz, ['ani','przec']) }",
"fzdsz(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd20), fzdj(Tfz, K, A, C, T, Neg, I, przec, _),\n" +
"	{ rowne(Tfz, ['co','jaki','kto','który']) }, \n" +
"	fzdkor(Tfz, bp, A1, C1, T1, Neg1, I, _),\n" +
"        { rozne(Oz, ani) }",
"fzdj(Tfz, K, A, C, T, Neg, I, przec, X)\n" +
"--> s(zd21), fzdkor(Tfz, K, A, C, T, Neg, I, @X)",
"fzdj(Tfz, K, A, C, T, Neg, I, Oz, @ @ @0)\n" +
"--> s(zd22), spoj(sz, Oz, I), \n" +
"        { rozne(Oz, ['ani','przec']) },\n" +
"	fzdkor(Tfz, K, A, C, T, Neg, ni,_),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']), \n" +
"        rozne(K, nk) },\n" +
"	przec,\n" +
"	fzdkor(Tfz, K1, A1, C1, T1, Neg1, ni, _),\n" +
"        { rowne(K1, [K,'bp']) }",
"fzdj(Tfz, K, A, C, T, Neg, I, Oz, @ @ @0)\n" +
"--> s(zd23), spoj(sz, Oz, I),\n" +
"        { rozne(Oz, ['ani','przec']) },\n" +
"	fzdkor(Tfz, K, A, C, T, Neg, ni, _),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']), \n" +
"          rozne(K, nk) },\n" +
"	przec,\n" +
"	fzdj(Tfz, K1, A1, C1, T1, Neg1, ni, Oz, _),\n" +
"        { rowne(K1, [K,'bp']) }",
"fzdj(Tfz, K, A, C, T, Neg, I, przec, @ @ @0)\n" +
"--> s(zd24), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']) }, \n" +
"	spoj(sz, przec, ni),\n" +
"	fzdkor(Tfz, K1, A1, C1, T1, Neg1, ni, _),\n" +
"        { rowne(K1, [K,'bp']) }",
"fzdj(Tfz, K, A, C, T, Neg, I, przec, @ @ @0)\n" +
"--> s(zd25), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['aż1','chociaż','czy','jak','jeśli',\n" +
"	              'podczas','ponieważ','pz','że']) },\n" +
"	spoj(sz, przec, ni),\n" +
"	fzdj(Tfz, K1, A1, C1, T1, Neg1, ni, przec, _),\n" +
"        { rowne(K1, [K,'bp']) }",
"fzdj(Tfz, bp, A, C, T, Neg, I, Oz, @ @ @0)\n" +
"--> s(zd26), spoj(sz, Oz, I),\n" +
"        { rozne(Oz, ['ani','przec']) },\n" +
"	fzdkor(Tfz, bp, A, C, T, Neg, ni, _),\n" +
"	{ rowne(Tfz, ['dopóki','zanim']) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	fzdkor(Tfz, bp, A1, C, T, Neg1, ni, _)",
"fzdj(Tfz, bp, A, C, T, Neg, I, Oz, @ @ @0)\n" +
"--> s(zd27), spoj(sz, Oz, I),\n" +
"        { rozne(Oz, ['ani','przec']) },\n" +
"	fzdkor(Tfz, bp, A, C, T, Neg, ni, _),\n" +
"	{ rowne(Tfz, ['dopóki','zanim']) },\n" +
"	przec,\n" +
"	fzdj(Tfz, bp, A1, C, T, Neg1, ni, Oz, _)",
"fzdj(Tfz, K, A, C, T, Neg, I, przec, @ @ @0)\n" +
"--> s(zd28), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['dopóki','zanim'])}, \n" +
"	spoj(sz, przec, ni),\n" +
"	fzdkor(Tfz, bp, A1, C, T, Neg1, ni, _)",
"fzdj(Tfz, K, A, C, T, Neg, I, przec, @ @ @0)\n" +
"--> s(zd29), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['dopóki','zanim'])},\n" +
"	spoj(sz, przec, ni),\n" +
"	fzdj(Tfz, bp, A1, C, T, Neg1, ni, przec, _)",
"fzdj(Tfz, bp, A, C, T, Neg, I, Oz, @ @ @0)\n" +
"--> s(zd30), spoj(sz, Oz, I),\n" +
"        { rozne(Oz, ['ani','przec']) },\n" +
"	fzdkor(Tfz, bp, A, C, T, Neg, ni, _),\n" +
"	{ rowne(Tfz, ['aż2','gdy']) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	fzdkor(Tfz, bp, A1, C, T1, Neg1, ni, _)",
"fzdj(Tfz, bp, A, C, T, Neg, I, Oz, @ @ @0)\n" +
"--> s(zd31), spoj(sz, Oz, I),\n" +
"        { rozne(Oz, ['ani','przec'])},\n" +
"	fzdkor(Tfz, bp, A, C, T, Neg, ni, _),\n" +
"	{ rowne(Tfz, ['aż2','gdy']) },\n" +
"	przec,\n" +
"	fzdj(Tfz, bp, A1, C, T1, Neg1, ni, Oz, _)",
"fzdj(Tfz, K, A, C, T, Neg, I, przec, @ @ @0)\n" +
"--> s(zd32), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['aż2','gdy']) }, \n" +
"	spoj(sz, przec, ni),\n" +
"	fzdkor(Tfz, bp, A1, C, T1, Neg1, ni, _)",
"fzdj(Tfz, K, A, C, T, Neg, I, przec, @ @ @0)\n" +
"--> s(zd33), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['aż2','gdy']) }, \n" +
"	spoj(sz, przec, ni),\n" +
"	fzdj(Tfz, bp, A1, C, T1, Neg1, ni, przec, _)",
"fzdj(Tfz, bp, A, C, T, Neg, I, Oz, @ @ @0)\n" +
"--> s(zd34), spoj(sz, Oz, ni),\n" +
"        { rozne(Oz, ['ani','przec']) },\n" +
"	fzdkor(Tfz, bp, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['co','jaki','kto','który']) },\n" +
"	przec,\n" +
"	spoj(sz, Oz, ni),\n" +
"	fzdkor(Tfz, bp, A1, C1, T1, Neg1, I, _)",
"fzdj(Tfz, bp, A, C, T, Neg, I, Oz, @ @ @0)\n" +
"--> s(zd35), spoj(sz, Oz, I),\n" +
"        { rozne(Oz, ['ani','przec']) },\n" +
"	fzdkor(Tfz, bp, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['co','jaki','kto','który']) },\n" +
"	przec,\n" +
"	fzdj(Tfz, bp, A1, C1, T1, Neg1, I, Oz, _)",
"fzdj(Tfz, K, A, C, T, Neg, I, przec, @ @ @0)\n" +
"--> s(zd36), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['co','jaki','kto','który']) }, \n" +
"	spoj(sz, przec, ni),\n" +
"	fzdkor(Tfz, bp, A1, C1, T1, Neg1, I, _)",
"fzdj(Tfz, K, A, C, T, Neg, I, przec, @ @ @0)\n" +
"--> s(zd37), fzdkor(Tfz, K, A, C, T, Neg, I, _),\n" +
"	{ rowne(Tfz, ['co','jaki','kto','który'])},\n" +
"	spoj(sz, przec, ni),\n" +
"	fzdj(Tfz, bp, A1, C1, T1, Neg1, I, przec, _)",
"fzdkor(Tfz, K, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd38), kor(K, I), \n" +
"	przec,\n" +
"	fzde(Tfz, A, C, T, Neg, ni)",
"fzdkor(Tfz, nk, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd39), przecsp, \n" +
"	fzde(Tfz, A, C, T, Neg, I)",
"fzdkor(Tfz, bp, A, C, T, Neg, I, @ @ @0)\n" +
"--> s(zd40), fzde(Tfz, A, C, T, Neg, I)",
"fzdkor(Tfz, K, A, C, T, Neg, I, X)\n" +
"--> s(zd41), fzd(Tfz, K, A, C, T, Neg, I, @X)",
"fzde(Tfz, A, C, T, Neg, I)\n" +
"--> s(zd42), spoj(po, Tfz, I),\n" +
"	{ rowne(Tfz, ['aż1','aż2','chociaż','czy','dopóki','gdy',\n" +
"	              'jak','jeśli','podczas','ponieważ','zanim','że']) },\n" +
"	zr(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z), _),\n" +
"	{ zrowne(Z, [Tfz], SwZ) }",
"fzde(Tfz, A, C, T, Neg, I)\n" +
"--> s(zd43), spoj(po, Tfz, ni),\n" +
"	{ rowne(Tfz, ['choćby','gdyby','jakby','jakoby','żeby']) },\n" +
"	zr(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), _),\n" +
"	{ zrowne(Z, [Tfz], SwZ) }",
"fzde(Tfz, A, C, T, Neg, I)\n" +
"--> s(zd44), zr(Wf, A, C, T, Rl, O, Neg, I, z(Tfz,Z), _),\n" +
"	{ zrowne(Z, ['co','jaki','kto','który','pz'], NZ),\n" +
"	rowne(Tfz, NZ) }",
"fzde(mie1, A, C, T, Neg, I)\n" +
"--> s(zd45), spoj(po, 'że', I), \n" +
"	zr(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z), _),\n" +
"	{ zrowne( Z, ['że'], SwZ ) }",
"fzde(mie1, A, C, T, Neg, I)\n" +
"--> s(zd46), zr(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), _),\n" +
"	{ zrowne( Z, [pz], SwZ ) }",
"fzde(mie2, A, C, T, Neg, I)\n" +
"--> s(zd47), spoj(po, 'że', I), \n" +
"	zr(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z), _),\n" +
"	{ zrowne( Z, ['że'], SwZ ) }",
"fzde(mie2, A, C, T, Neg, I)\n" +
"--> s(zd48), spoj(po, 'żeby', ni), \n" +
"	zr(Wf, A, C, T, Rl, O, Neg, I, z(SwZ,Z), _),\n" +
"	{ zrowne( Z, ['żeby'], SwZ ) }",
"fzde(mie3, A, C, T, Neg, I)\n" +
"--> s(zd49), spoj(po, gdy, I), \n" +
"	zr(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z), _),\n" +
"	{ zrowne( Z, [gdy], SwZ ) }",
"fzde(mie3, A, C, T, Neg, I)\n" +
"--> s(zd50), spoj(po, jak, I), \n" +
"	zr(Wf, A, C, T, Rl, O, Neg, ni, z(SwZ,Z), _),\n" +
"	{ zrowne( Z, [jak], SwZ ) }",
"spoj(Tsp, Oz, I)       --> s(spoj1), spoj1(Tsp, Oz), \n" +
"                          spoj(Tsp1, I, ni),\n" +
"                          { rowne(I, ['bowiem','natomiast','więc','zaś']),\n" +
"			    rowne(Tsp1, [pi,ri]) }",
"spoj(Tsp, Oz, ni)      --> s(spoj2), spoj1(Tsp, Oz)",
"spoj1(rl, F)           --> s(spoj3), spojnik(F), \n" +
"                          { rowne(F, ['nie','tak','zarówno'])}",
"spoj1(rl, nietylko)    --> s(spoj4), partykula(nie), \n" +
"                          partykula(tylko)",
"spoj1(rp, nie)         --> s(spoj5), spojnik(F), \n" +
"                          { rowne(F, ['ale','lecz'])}",
"spoj1(rp, nietylko)    --> s(spoj6), spojnik(F), \n" +
"                          partykula(F1),\n" +
"                          { rowne(F, ['ale','lecz']), \n" +
"                           rowne(F1, ['i','również','także'])}",
"spoj1(rp, F)           --> s(spoj7), spojnik(jak), \n" +
"                          { rowne(F, ['tak','zarówno'])}",
"spoj1(rp, F)          \n" +
"                        --> s(spoj8), spojnik(jak), \n" +
"                          partykula(F1),\n" +
"                          { rowne(F, ['tak','zarówno']), \n" +
"                           rowne(F1, ['i','też'])}",
"spoj1(rc, a)           --> s(spoj9), spojnik(F), \n" +
"                          { rowne(F, ['a','ale','lecz'])}",
"spoj1(rc, alei)        --> s(spoj10), spojnik(F), \n" +
"                          partykula(F1),\n" +
"                          { rowne(F, ['a','ale','lecz']), \n" +
"                           rowne(F1, ['i','nawet','również','także'])}",
"spoj1(rc, natomiast)   --> s(spoj11), spojnik(natomiast)",
"spoj1(rc, nie)         --> s(spoj12), spojnik(F), \n" +
"                          partykula(nie),\n" +
"                          { rowne(F, ['a','ale'])}",
"spoj1(rc, nie)  \n" +
"                        --> s(spoj13), partykula(nie), \n" +
"                          spojnik('zaś')",
"spoj1(ri, F)           --> s(spoj14), spojnik(F), \n" +
"                          { rowne(F, ['natomiast','zaś'])}",
"spoj1(Tsp, F)          --> s(spoj15), spojnik(F), \n" +
"                          { rowne(Tsp, ['sz','szk']), \n" +
"                           rowne(F, ['albo','bądź','i','lub'])}",
"spoj1(Tsp, ani)        --> s(spoj16), spojnik(F), \n" +
"                          { rowne(Tsp, ['sz','szk']), \n" +
"                           rowne(F, ['ani','ni'])}",
"spoj1(Tsp, przec)      --> s(spoj17), przec,\n" +
"	                   { rowne(Tsp, ['sz','szk']) }",
"spoj1(szk, F)          --> s(spoj18), spojnik(F), \n" +
"                          partykula(F1),\n" +
"                          { rowne(F, ['albo','bądź','lub']), \n" +
"                           rowne(F1, ['nawet','też'])}",
"spoj1(szk, ani)        --> s(spoj19), spojnik(F), \n" +
"                          partykula(F1),\n" +
"                          { rowne(F, ['ani','ni']), \n" +
"                           rowne(F1, ['nawet','też'])}",
"spoj1(szk, i)          --> s(spoj20), spojnik(i), \n" +
"                          partykula(F1),\n" +
"                          { rowne(F1, ['nawet','także'])}",
"spoj1(szk, i)         \n" +
"                        --> s(spoj21), spojnik(oraz)",
"spoj1(Tsp, 'dopóki')     --> s(spoj22), spojnik(F), \n" +
"                          { rowne(Tsp, ['pl','pp']), \n" +
"                           rowne(F, ['dopóty','póty'])}",
"spoj1(Tsp, gdy)        --> s(spoj23), spojnik(F), \n" +
"                          { rowne(Tsp, ['pl','pp']), \n" +
"                           rowne(F, ['wówczas','wtedy'])}",
"spoj1(pp, Oz)          --> s(spoj24), spojnik(jednak), \n" +
"                          { rowne(Oz, ['chociaż','choćby'])}",
"spoj1(pp, Oz)         \n" +
"                        --> s(spoj25), spojnik(to), \n" +
"                          spojnik(jednak),\n" +
"                          { rowne(Oz, ['chociaż','choćby'])}",
"spoj1(pp, Oz)         \n" +
"                        --> s(spoj26), spojnik(to), \n" +
"                          { rowne(Oz, ['chociaż','choćby','gdyby','jeśli'])}",
"spoj1(pc, bo)     --> s(spoj27), spojnik(F), \n" +
"                          { rowne(F, ['albowiem','bo','gdyż'])}",
"spoj1(Tsp, 'więc')       --> s(spoj28), spojnik(F), \n" +
"                          { rowne(Tsp, ['pc','pi']), \n" +
"                           rowne(F, ['przeto','więc','zatem'])}",
"spoj1(pc, 'więc')        --> s(spoj29), spojnik('toteż')",
"spoj1(pi, bowiem)      --> s(spoj30), spojnik(bowiem)",
"spoj1(po, Oz)          --> s(spoj31), spojnik('aż'), \n" +
"                          { rowne(Oz, ['aż1','aż2'])}",
"spoj1(po, Oz)         \n" +
"                        --> s(spoj32), spojnik(Oz), \n" +
"                          { rowne(Oz, ['czy','jak','jakby','jakoby'])}",
"spoj1(po, 'chociaż')     --> s(spoj33), spojnik(F), \n" +
"                          { rowne(F, ['chociaż','choć'])}",
"spoj1(po, 'chociaż')    \n" +
"                        --> s(spoj34), przyimek(mimo, dop), \n" +
"                          spojnik('że')",
"spoj1(po, 'choćby')      --> s(spoj35), spojnik(F), \n" +
"                          { rowne(F, ['chociażby','choćby'])}",
"spoj1(po, 'dopóki')      --> s(spoj36), spojnik(F), \n" +
"                          { rowne(F, ['dopóki','póki'])}",
"spoj1(po, gdy)         --> s(spoj37), spojnik(F), \n" +
"                          { rowne(F, ['gdy','kiedy'])}",
"spoj1(po, gdyby)       --> s(spoj38), spojnik(F), \n" +
"                          { rowne(F, ['gdyby','jeśliby','jeżeliby'])}",
"spoj1(po, 'jeśli')       --> s(spoj39), spojnik(F), \n" +
"                          { rowne(F, ['jeśli','jeżeli'])}",
"spoj1(po, podczas)     --> s(spoj40), przyimek(podczas, dop), \n" +
"                          spojnik(gdy)",
"spoj1(po, 'ponieważ')    --> s(spoj41), spojnik(F), \n" +
"                          { rowne(F, ['ponieważ','skoro','że'])}",
"spoj1(po, zanim)       --> s(spoj42), spojnik(F), \n" +
"                          { rowne(F, ['nim','zanim'])}",
"spoj1(po, 'że')          --> s(spoj43), spojnik(F), \n" +
"                          { rowne(F, ['iż','że'])}",
"spoj1(po, 'żeby')        --> s(spoj44), spojnik(F), \n" +
"                          { rowne(F, ['aby','ażeby','by','iżby','żeby'])}",
];
