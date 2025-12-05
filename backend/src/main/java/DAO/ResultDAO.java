package DAO;

import java.util.logging.Logger;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.write.Point;

import DTO.Result;

public class ResultDAO implements InterfaceDAO{
     private static final Logger logger = Logger.getLogger(ResultDAO.class.getName());
    private static InfluxDBClient client;
    private static final String BUCKET = "result";
    

    public static void instantiate(Result result, String user){
        if (client == null){
            try {
                client = InfluxDBClientFactory.create(HOST,TOKEN,ORG,BUCKET);
            } catch (Exception e) {
                logger.info(e.toString());
            }
        }
        try {
            writeData(client, result, user);
            queryData(client);
        } catch (Exception e) {
            logger.info(e.toString());
        }

    }

    private static void writeData(InfluxDBClient client, Result result, String user){
        Point point = Point.measurement("result")
            .addTag("user", user)
            .addField("x", result.x())
            .addField("y", result.y())
            .addField("r", result.r())
            .addField("hit", result.hit())
            .addField("scriptTime", result.scriptTime())
            .addField("serverTime", result.serverTime());
        try {
            WriteApiBlocking writeApi = client.getWriteApiBlocking();
            writeApi.writePoint(BUCKET, ORG, point);
            logger.info("Данные отправились в базу "+ ORG + BUCKET);
        } catch (Exception e) {
            logger.info("Данные не отправились: "+ e.toString());
        }
    }

    private static void queryData(InfluxDBClient client){
        //String sql = "SELECT * FROM \"result\" WHERE user == \"log_test\"";
        String fluxRequest = String.format("""
                                           from(bucket: "%s") |> range(start: 0)
                                             |> filter(fn: (r) => r["_measurement"] == "result")
                                             |> filter(fn: (r) => r["user"] == "log_test")
                                             |> filter(fn: (r) => r["_field"] == "x")""" //
        //
        //
        ,
                BUCKET);
        try {
            QueryApi queryApi = client.getQueryApi();
            queryApi.query(fluxRequest, (cancellable, record) -> {
                System.out.println(record.getValues().get("_value"));
            });
        } catch (Exception e) {
            logger.info("Данные не взялись из таблицы: " + e.toString());
        }
       
    }
}
