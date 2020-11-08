import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { IUser } from '../User';
import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';


@Injectable()
export class UserService {

    private Url                   = 'https://cardit.co.za/';
    private testUrl               = 'https://carditweb.conveyor.cloud/'; 
    private localUrl              = 'https://192.168.8.103:45455/';
    private _localRegisterUrl     = this.Url + 'api/RegisterUser';
    private _localLoginUrl        = this.Url + 'api/CheckToken';
    private _localUserDataUrl     = this.Url + 'api/UserData';

    constructor(private _http: HttpClient, private storage: Storage){}

    registerUser(name , email, mobileNumber, password): Observable<any> {
        console.log('Registering user .....');
        return this._http.get<any>(this._localRegisterUrl + '?name=' + name + '&email='
        + email + '&mobileNumber=' + null + '&password=' + password);
    }

    Login(email: string,password: string): Observable<any> {
      return this._http.get<any>(this._localLoginUrl + '?email=' + email + '&password=' + password) ;
    }

}
