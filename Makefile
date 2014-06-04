NAME     = armagetronad-authority-generator
DIST_DIR = dist
NPM_BIN  = node_modules/.bin

BUNDLED_JS_FILE  = ${DIST_DIR}/bundle.js
BUNDLED_CSS_FILE = ${DIST_DIR}/app.css
BROWSERIFY_ARGS  = -o ${BUNDLED_JS_FILE} --transform partialify lib/js/main.js

MANIFEST = index.html \
           LICENSE.txt \
		   README.md \
		   lib/php/armaauth.php \
		   ${BUNDLED_JS_FILE} \
		   ${BUNDLED_CSS_FILE} \
		   $(wildcard node_modules/font-awesome/fonts/*)

test:
	@${NPM_BIN}/mocha

${DIST_DIR}:
	@mkdir ${DIST_DIR}

linkCSS: ${DIST_DIR}
	@rm -f ${BUNDLED_CSS_FILE}
	@cd ${DIST_DIR} && ln -s ../lib/css/app.css

install: linkCSS
	${NPM_BIN}/browserify ${BROWSERIFY_ARGS}
	${NPM_BIN}/uglifyjs --no-copyright --output ${BUNDLED_JS_FILE} ${BUNDLED_JS_FILE} --compress --mangle --define DEBUG=false 2>/dev/null
	${NPM_BIN}/cleancss --s0 ${BUNDLED_CSS_FILE} > ${BUNDLED_CSS_FILE}.min
	@rm ${BUNDLED_CSS_FILE} && mv ${BUNDLED_CSS_FILE}.min ${BUNDLED_CSS_FILE}

run: linkCSS
	${NPM_BIN}/watchify -v ${BROWSERIFY_ARGS} || true

clean:
	@rm -rf ${DIST_DIR}

dist-install: install
	@rm -rf ${DIST_DIR}/${NAME} ${DIST_DIR}/${NAME}.tgz
	@for dir in $(dir ${MANIFEST}); do mkdir -p ${DIST_DIR}/${NAME}/$${dir}; done
	@for file in ${MANIFEST}; do install $${file} ${DIST_DIR}/${NAME}/$${file}; done
	tar -czf ${DIST_DIR}/${NAME}.tgz -C ${DIST_DIR} ${NAME}

.PHONY: clean dist-install install linkCSS run test
