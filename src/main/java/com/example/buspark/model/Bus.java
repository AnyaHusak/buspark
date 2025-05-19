package com.example.buspark.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "buses")
public class Bus {
    @Id
    private int number;
    private String driver;
    private String route;
    private boolean onRoute; // true — на маршруті, false — в парку

    public Bus() {}

    public Bus(int number, String driver, String route, boolean onRoute) {
        this.number = number;
        this.driver = driver;
        this.route = route;
        this.onRoute = onRoute;
    }

    public int getNumber() { return number; }
    public void setNumber(int number) { this.number = number; }

    public String getDriver() { return driver; }
    public void setDriver(String driver) { this.driver = driver; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public boolean isOnRoute() { return onRoute; }
    public void setOnRoute(boolean onRoute) { this.onRoute = onRoute; }
}
