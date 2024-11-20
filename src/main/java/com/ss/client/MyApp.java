package com.ss.client;


import com.ss.client.ui.MainPageView;
import com.ss.client.ui.MainPagePresenter;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.RootPanel;

public class MyApp implements EntryPoint {
    @Override
    public void onModuleLoad() {
        MainPageView mainPageView = new MainPageView();
        MainPagePresenter presenter = new MainPagePresenter(mainPageView);
        presenter.bind();
        RootPanel.get("ui-container").add(mainPageView);
    }
}