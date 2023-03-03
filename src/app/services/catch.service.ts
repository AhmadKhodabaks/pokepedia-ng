import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon.model';
import { User } from '../models/user.model';
import { PokemonCatalogueService } from './pokemon-catalogue.service';
import { UserService } from './user.service';

const { apiKey, apiUsers } = environment;

@Injectable({
  providedIn: 'root'
})
export class CatchService {

  private _loading: boolean = false;

  get loading(): boolean {
    return this._loading;
  }

  constructor(private readonly pokemonService: PokemonCatalogueService, private readonly userService: UserService, private http: HttpClient) { }

  public addToCaught(pokemonId: number): Observable<User> {
    if (!this.userService.user) {
      throw new Error("addtoCaught: There is no user");
    }
    const user: User = this.userService.user;

    const pokemon: Pokemon | undefined = this.pokemonService.pokemonById(pokemonId);

    if (!pokemon) {
      throw new Error("addToCaught: No pokemon with ID: " + pokemonId);
    }

    if (this.userService.isCaught(pokemonId)) {
      this.userService.removeFromCaught(pokemonId);
    } else {
      this.userService.addToCaught(pokemon);
    }


    const headers = new HttpHeaders({
      "content-type": "application/json",
      "x-api-key": apiKey,
    });

    this._loading = true;

    return this.http.patch<User>(`${apiUsers}/${user.id}`,
      {
        pokemon: [...user.pokemon]
      }, {
      headers
    })
      .pipe(
        tap((updatedUser: User) => {
          this.userService.user = updatedUser;
        }),
        finalize(() => {
          this._loading = false;
        })
      );
  }
}

