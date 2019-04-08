﻿import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { Product } from './../shared/models';
import { Helpers } from './../shared/helpers';
import { SessionService } from './../services/session.service';
import { BrandService } from './../services/brand.service';
import { ProductService } from './../services/product.service';

@Component({
    selector: 'app-products',
    templateUrl: 'products.component.html'
})

export class ProductsComponent implements OnInit {
    totalRecords = 0;
    selected: Product;
    allbrands: SelectItem[];
    types: SelectItem[];
    brands: SelectItem[];
    sliderValue: number;
    buttons: MenuItem[];
    categories: SelectItem[];
    categoryValue: string;

    constructor(private router: Router,
        private translate: TranslateService,
        private messageService: MessageService,
        private sessionService: SessionService,
        private productService: ProductService,
        private brandService: BrandService) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Products');

        this.buttons = [];
        this.translate.get('Edit').subscribe((res: string) =>
            this.buttons.push({ label: res, icon: 'pi pi-pencil', command: (event) => this.openClick() }));
        this.translate.get('Stock').subscribe((res: string) =>
            this.buttons.push({ label: res, icon: 'pi pi-list', command: (event) => this.stockClick() }));

        if (this.products == null) {
            this.refreshClick();
        } else {
            this.refreshControl();
        }

        this.productService.getTypes()
            .subscribe(result => this.types = result.map(p => Helpers.newSelectItem(p.value)));

        this.brandService.getAll()
            .subscribe(result => {
                this.allbrands = result.map(p => Helpers.newSelectItem(p, p.brandName));
            });
    }

    set products(value) { this.productService.products = value; }
    get products(): Product[] { return this.productService.products; }

    get selectedIndex(): number { return this.products.indexOf(this.selected); }

    buildFilter(items: Product[]) {
        this.translate.get('All').subscribe((res: string) => {
            this.brands = [];
            this.brands.push({label: res, value: null});
            const filterBrands = Helpers.distinct(items.map((item: Product) => Helpers.newSelectItem(item.brand.brandName)));
            this.brands = this.brands.concat(filterBrands);

            this.categories = [];
            this.categories.push({label: res, value: null});
            const array = items.map(p => p.categories.map(c => c.category.categoryName)).join(',');
            const filterCategories = Helpers.distinct(array.split(',').map(item => Helpers.newSelectItem(item)));
            this.categories = this.categories.concat(filterCategories);
        });
    }

    refreshClick() {
        this.products = null;
        this.productService.getProducts()
            .subscribe(result => {
                this.products = result;
                this.refreshControl();
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    private refreshControl() {
        this.totalRecords = this.products.length;
        this.buildFilter(this.products);
    }

    addClick() {
        this.router.navigateByUrl('product/0');
    }

    openClick() {
        this.router.navigateByUrl('product/' + this.selected.productId);
    }

    stockClick() {
        this.router.navigateByUrl('product/' + this.selected.productId + '/stock');
    }
}