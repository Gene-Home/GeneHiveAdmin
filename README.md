An Admin front end for the Gene Hive Application.

Getting Started (quick and easy with nginx)

(assuming ngix is installed)
- Clone from git
-   Ensure bower is installed - `npm install -g bower`
-  Install dependencies - `bower install`
-   Make sure nginx can serve files - just have a link or copy files in nginx's root (perhaps /var/www)
-   Add a proxy for gene-hive's api - see the nginx_example.conf
-   Change the api_url variable to reflect the API's url

