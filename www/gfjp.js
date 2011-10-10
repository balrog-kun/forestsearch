/*
 * cat gfjp.dcg gfjp-elem.dcg | iconv --from-code=latin2 \
 *      --to-code=utf8 | grep '^\(% 5\|[a-z0-9]\+\)' > gfjp.js
 * :%s,^\([a-z0-9]\+\)(.*,\1,
 * :%s/^\([a-z0-9].\+\)/^I^I"\1",/
 * :%s/^% \(.\+\)/^I],^M^I"\1": [/
 */
gfjp.sections = {
	"5.1. Wypowiedzenie": [
		"wypowiedzenie",
	],
	"5.2. Zdanie równorzędne": [
		"zr",
	],
	"5.3. Zdanie szeregowe": [
		"zsz",
	],
	"5.4. Zdanie jednorodne": [
		"zj",
	],
	"5.5. Zdanie proste": [
		"zp",
	],
	"5.6. Zdanie elementarne": [
		"ze",
	],
	"5.7. Fraza finitywna": [
		"ff",
		"ff1",
	],
	"5.8. Fraza wymagana": [
		"fw",
		"fw1",
	],
	"5.9. Fraza luźna": [
		"fl",
		"fl1",
	],
	"5.10. Fraza werbalna": [
		"fwe",
		"kweneg",
		"kweink",
		"kwer",
		"kwer1",
	],
	"5.11. Fraza przyimkowa": [
		"fpm",
	],
	"5.12. Fraza nominalna": [
		"fno",
		"knodop",
		"knopm",
		"knoatr",
		"knoink",
		"knom",
	],
	"5.13. Fraza przymiotnikowa": [
		"fpt",
		"kptno",
		"kptpm",
		"kptps",
		"kptink",
		"kprzym",
	],
	"5.14. Fraza przysłówkowa": [
		"fps",
		"kpspm",
		"kpsps",
		"kpsink",
		"kprzysl",
	],
	"5.15. Fraza zdaniowa": [
		"fzd",
		"fzdsz",
		"fzdj",
		"fzdkor",
		"fzde",
	],
	"5.16. Jednostki funkcyjne": [
		"spoj",
		"spoj1",
	],
	"5.16.2: Zaimek": [
		"zaimpyt",
		"zaimwzg",
		"zaimno",
	],
	"5.16.2.3. Zaimki nieokreślone ": [
		"zaimno",
		"zaimneg",
	],
	"5.16.3 i n.:": [
		"pyt",
		"agl",
		"agl1",
		"kor",
		"kor1",
	],
	"5.17:": [
		"przecsp",
		"przec",
		"morfagl",
		"partykula",
		"przyimek",
		"spojnik",
		"zaimrzecz",
		"zaimprzym",
		"zaimprzys",
		"formarzecz",
		"formaprzym",
		"formaprzysl",
		"zaimos",
		"formaczas",
		"formaczas1",
		"przyzlo",
		"formaczas1",
		"condaglt",
		"formaczas1",
	],
};
