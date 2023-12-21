.PHONY: init
init:
	npm install
	test -f .env || cp .env.example .env
	@echo "----------------- Please fill in the .env file with your own credentials -----------------"  
	@echo "--------------------- A sample .env file is provided as .env.example ---------------------"
	@echo "------- API link https://developer.themoviedb.org/docs/authentication-application --------"

.PHONY: start
start:
	npm run dev

.PHONY: build
build:
	npm run build

