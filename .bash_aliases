export PATH=$PATH:~/Workspace/pfc-laminas-node/node_modules/.bin/
alias recreate_test_db='node admin-utils/drop_database.js test && node admin-utils/create_database.js test && NODE_ENV=test sequelize db:migrate'