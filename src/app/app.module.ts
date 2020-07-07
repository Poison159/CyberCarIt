import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CardService } from './services/CardService';
import { UserService } from './services/UserService';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { ModalPagePageModule } from './modal-page/modal-page.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LogModPageModule } from './log-mod/log-mod.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    ModalPagePageModule,
    LogModPageModule],
  providers: [
    StatusBar,
    CardService,
    BarcodeScanner,
    UserService,
    SplashScreen,
    HttpClient,
    ActionSheet,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
