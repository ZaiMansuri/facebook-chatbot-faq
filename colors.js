'use strict';
const request = require('request');
const config = require('./config');
const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {

    readAllColors: function(callback) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function(err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client
                .query(
                    'SELECT color FROM public.iphone8_colors',
                    function(err, result) {
                        if (err) {
                            console.log(err);
                            callback([]);
                        } else {
                            let colors = [];
                            for (let i = 0; i < result.rows.length; i++) {
                                colors.push(result.rows[i]['color']);
                            }
                            callback(colors);
                        };
                    });
        });
        pool.end();
    },


    readUserColor: function(callback, userId) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function(err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client
                .query(
                    'SELECT color FROM public.users WHERE fb_id=$1',
                    [userId],
                    function(err, result) {
                        if (err) {
                            console.log(err);
                            callback('');
                        } else {
                            callback(result.rows[0]['color']);
                        };
                    });

        });
        pool.end();
    },

    updateUserColor: function(color, userId) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function(err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            let sql1 = `SELECT color FROM public.user_color where fb_id='${userId}' LIMIT 1`;
            client
            .query(sql1, function (err, result) {
                if(err){
                    console.log('query Error:: '+err);
                }
                else {
                    let sql;
                    if(result.rows.length === 0){
                        sql = 'INSERT INTO public.user_color (color,fb_id) VALUES($1,$2)';
                        console.log('record inserted result is ='+JSON.stringify(result));
                    }
                    else {
                        sql = 'UPDATE public.user_color SET color=$1 WHERE fb_id=$2';
                        console.log('record update result is ='+JSON.stringify(result));
                    }
                    client.query(sql,
                        [
                            color,
                            userId
                        ]);
                        console.log('record changes done');
                }                
            });
         

        });
        pool.end();
    }

   

}