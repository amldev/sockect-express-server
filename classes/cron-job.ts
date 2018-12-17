const cron = require("node-cron");
export class CronJob {

   executeUpdate() {
        // CRON JOB
        /**
         * s = second
         * m = minute
         * h = hour
         * d = month day
         * wd = day of week
         *  s    m    h    d    m    wd
         *  ┬    ┬    ┬    ┬    ┬    ┬
         *  │    │    │    │    │    │
         *  │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
         *  │    │    │    │    └───── month (1 - 12)
         *  │    │    │    └────────── day of month (1 - 31)
         *  │    │    └─────────────── hour (0 - 23)
         *  │    └──────────────────── minute (0 - 59)
         *  └───────────────────────── second (0 - 59, OPTIONAL)
         */
        cron.schedule("5 * * * * *", function () {
            console.log("---------------------");
            console.log("Running Cron Job");
            const date = new Date();
            console.log(date.getHours(), date.getMinutes(), date.getSeconds());
            
        });
   }

}