An Admin front end for the Gene Hive Application.

Getting Started (quick and easy with nginx)

(assuming ngix is installed)
1) Clone from git
2) Ensure bower is installed - npm install -g bower
3) Install dependencies - bower install
2) Make sure nginx can serve files - just have a link or copy files in nginx's root (perhaps /var/www)
3) Add a proxy for gene-hive's api - see the nginx_example.conf

