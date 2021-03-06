import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Product } from '../shared/models';

@Injectable()
export class ImportService {

    //apiRoot: String = 'https://www.tessilnova.com:443';
    apiRoot: String = 'http://www.grisolini.com:8080';

    constructor(private http: HttpClient) {
    }

    getProducts(): Observable<Translate[]> {
        //const apiURL = `${this.apiRoot}/api/codart/products`;
        const apiURL = `${this.apiRoot}/webretail/ecommerce/list`;
        return this.http.get<Translate[]>(apiURL);
    }

    getProductById(id: String): Observable<CodartInfo> {
        //const apiURL = `${this.apiRoot}/api/codart/${id}`;
        const apiURL = `${this.apiRoot}/webretail/ecommerce/commerce?codart=${id}`;
        return this.http.get<CodartInfo>(apiURL);
    }

    getQuantity(barcode: String): Observable<Quantity> {
        //const apiURL = `${this.apiRoot}/api/codart/${id}`;
        const apiURL = `${this.apiRoot}/webretail/ecommerce/sync?barcode=${barcode}`;
        return this.http.get<Quantity>(apiURL);
    }

    create(model: Product): Observable<any> {
        return this.http.post<any>('/api/product/import', model);
    }
}

export interface CodartInfo {
    id: string;
    name: string;
    desc: string;
    price: number;
    discount: number;
    producer: Producer;
    category: Category;
    subcategory: Category;
    featured: boolean;
    published: Date;
    codarts: Codart[];
    medias: Image[];
    translates: Translate[];
}

export interface Category {
    id: string;
    desc: string;
    translates: Translate[];
}

export interface Producer {
    id: string;
    desc: string;
}

// export interface Stock {
//     saleartMag: string;
//     saleartId: number;
//     saleartGia: number;
//     saleartQtimp: number;
// }

export interface Codart {
    id: number;
    barcode: string;
    colorId: string;
    color: string;
    size: string;
//    stock: Stock;
}

export interface Image {
    id: number;
    codartCode: string;
    filename: string;
    number: number;
    url: string;
}

export interface Translate {
    id: number;
    key: string;
    code: string;
    value: string;
}

export interface Quantity {
    stock: number;
    booked: number;
}
