PACKAGE=stockbuzz-web

.PHONY: all install clean

all:
	grunt

clean:
	rm -rf dist
	rm -rf _install
	rm -rf _tarball

install:
	# config
	php ./tool/apply_config.php --type rel
	# dist
	[ -d _install/var/www ] || mkdir -p _install/var/www/stockbuzz
	cp -r dist _install/var/www/stockbuzz
	# tar
	[ -d _tarball ] || mkdir -p _tarball
	tar -czvf _tarball/${PACKAGE}.tar.gz -C _install .

install-dev:
	# config
	php ./tool/apply_config.php --type dev
	# dist
	[ -d _install/var/www ] || mkdir -p _install/var/www/stockbuzz
	cp -r dist _install/var/www/stockbuzz
	# tar
	[ -d _tarball ] || mkdir -p _tarball
	tar -czvf _tarball/${PACKAGE}.tar.gz -C _install .
