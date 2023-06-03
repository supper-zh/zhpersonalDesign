package com.sea.zh.dto;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;


/**
 * ShipDTO（Data Transfer Object）：
 *
 * ShipDTO是一种数据传输对象，用于在应用程序的不同层之间传递数据。它通常用于在前端和后端之间进行数据交互，或者在服务层和持久层之间传递数据。
 * ShipDTO主要用于数据的传输和展示，通常包含与前端交互的字段和属性，并可能进行一些数据格式转换或处理，以适应前端的需求。
 * ShipDTO类通常包含与数据库结构不完全一致的字段，可以根据需要进行组合、转换或筛选，以满足特定的数据传输需求。
 * **/

@Document(collection = "ship") // 指定与MongoDB中的集合关联
public class ShipDTO {

    @Id
    private String id;

    @Field("targetId")
    private String targetId;

    @Field("mmsi")
    private int mmsi;

    @Field("heading")
    private int heading;

    @Field("latitude")
    private double latitude;

    @Field("length")
    private int length;

    @Field("type")
    private String type;

    @Field("speed")
    private int speed;

    @Field("quality")
    private int quality;

    @Field("receiveTime")
    private long receiveTime;

    @Field("course")
    private int course;

    @Field("fixed")
    private boolean fixed;

    @Field("state")
    private int state;

    @Field("longitude")
    private double longitude;

    @Field("timestamp")
    private long timestamp;


    // Getter and Setter methods

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public int getMmsi() {
        return mmsi;
    }

    public void setMmsi(int mmsi) {
        this.mmsi = mmsi;
    }

    public int getHeading() {
        return heading;
    }

    public void setHeading(int heading) {
        this.heading = heading;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public int getQuality() {
        return quality;
    }

    public void setQuality(int quality) {
        this.quality = quality;
    }

    public long getReceiveTime() {
        return receiveTime;
    }

    public void setReceiveTime(long receiveTime) {
        this.receiveTime = receiveTime;
    }

    public int getCourse() {
        return course;
    }

    public void setCourse(int course) {
        this.course = course;
    }

    public boolean isFixed() {
        return fixed;
    }

    public void setFixed(boolean fixed) {
        this.fixed = fixed;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
