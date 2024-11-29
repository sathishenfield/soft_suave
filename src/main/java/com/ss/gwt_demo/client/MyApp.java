package com.ss.gwt_demo.client;


import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.RootPanel;
//import com.ss.gwt_demo.client.ui.MainPagePresenter;
//import com.ss.gwt_demo.client.ui.MainPageView;



public class MyApp implements EntryPoint {
    @Override
    public void onModuleLoad() {
          System.out.println("inside");
//        MainPageView mainPageView = new MainPageView();
//        MainPagePresenter presenter = new MainPagePresenter(mainPageView);
//        presenter.bind();
//        RootPanel.get("ui-container").add(mainPageView);

        RootPanel.get().add(new Label("Hello, GWT!"));
    }
}