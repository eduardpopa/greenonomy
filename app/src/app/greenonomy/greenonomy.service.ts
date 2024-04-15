import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  combineLatest,
  first,
  from,
  map,
  switchMap,
  of,
} from 'rxjs';
import { IItem, IMarket } from './greenonomy.models';
import { environment } from '../../environment/environment';
import Web3, { Contract, eth } from 'web3';
declare var window: any;

interface Response<T> {
  ok: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class GreenonomyService {
  private web3: Web3;
  private metamask: Web3;
  private marketContract;
  private itemContract;
  private greenomContract;
  constructor(private httpClient: HttpClient) {
    this.web3 = new Web3(environment.geenonomy.providerUrl);
    if (window.ethereum) {
      this.metamask = new Web3(window.ethereum);
      this.marketContract = new this.web3.eth.Contract(
        environment.geenonomy.contractMarketABI,
        environment.geenonomy.contractMarketAddress
      );
      this.itemContract = new this.web3.eth.Contract(
        environment.geenonomy.contractIemABI,
        environment.geenonomy.contractItemAddress
      );
    } else {
      alert('Please download metamask');
    }
  }
  getCurrentBlock(): Observable<bigint> {
    return from(this.web3.eth.getBlockNumber());
  }
  getMetamaskAccounts(): Observable<string[]> {
    return from(
      window.ethereum.request({ method: 'eth_requestAccounts' })
    ).pipe(switchMap(() => from(this.metamask.eth.getAccounts())));
  }
  getGreenomAddress(): Observable<string> {
    return from(this.marketContract.methods.getGreenomAddress().call()).pipe(
      map((res) => (res ? res.toString() : 'No address'))
    );
  }
  invite(address: string): Observable<string> {
    return this.getMetamaskAccounts().pipe(
      switchMap((accounts) => {
        return from(
          this.marketContract.methods
            .invite(address)
            .send({ from: accounts[0], gas: '1000000', gasPrice: '1000000000' })
        ).pipe(map((res) => (res ? res.toString() : 'No address')));
      })
    );
  }
  getItemAddress(): Observable<string> {
    return from(this.marketContract.methods.getItemAddress().call()).pipe(
      map((res) => (res ? res.toString() : 'No address'))
    );
  }
  getItemMetadata(tokenId: string): Observable<IItem> {
    return from(this.itemContract.methods.getMetadata(tokenId).call()).pipe(
      map((res) => res as IItem)
    );
  }
  createItem(uri: string): Observable<string> {
    // const contract = new this.web3.eth.Contract(
    //   environment.geenonomy.contractMarketABI,
    //   environment.geenonomy.contractMarketAddress
    // );
    return this.getMetamaskAccounts().pipe(
      switchMap((accounts) => {
        const params = {
          from: accounts[0],
          gas: '1000000',
          gasPrice: '1000000000',
        };
        return from(
          this.marketContract.methods.createItem(uri).send(params)
        ).pipe(map((res) => (res ? res.toString() : 'No address')));
      })
    );
  }
  getMarketItems(): Observable<IItem[]> {
    return from(this.marketContract.methods.listedTokens().call()).pipe(
      switchMap((items) => {
        const res: string[] = (items as string[]) || [];
        if (res.length <= 0) {
          return of([]);
        }
        return combineLatest(
          res.map((r) => from(this.itemContract.methods.getMetadata(r).call()))
        ).pipe(
          map((res) => {
            return res.map((m: any) => {
              return {
                uri: m['uri'],
                value: m['value'],
              };
            });
          })
        );
      })
    );
    // return itemsObs$;
  }
  getMyItems(): Observable<IItem[]> {
    return this.getMetamaskAccounts().pipe(
      switchMap((accounts) => {
        return from(this.itemContract.methods.getMyTokens().call()).pipe(
          switchMap((items) => {
            const res: string[] = (items as string[]) || [];
            if (res.length <= 0) {
              return of([]);
            }
            return combineLatest(
              res.map((r) =>
                from(this.itemContract.methods.getMetadata(r).call())
              )
            ).pipe(
              map((res) => {
                return res.map((m: any) => {
                  return {
                    uri: m['uri'],
                    value: m['value'],
                  };
                });
              })
            );
          })
        );
      })
    );

    // return itemsObs$;
  }
}
