import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pokemon, PokemonResponse } from '../models/pokemon.model';

const { apiPokemon, apiSprites } = environment;
const POKEMON_PAGE_LIMIT = 1000;

@Injectable({
  providedIn: 'root'
})
export class PokemonCatalogueService {

  private _pokemons: Pokemon[] = [];
  private _error: string = "";
  private _loading: boolean = false;

  get pokemons(): Pokemon[] {
    return this._pokemons;
  }

  get error(): string {
    return this._error;
  }

  get loading(): boolean {
    return this._loading;
  }

  constructor(private readonly http: HttpClient) { }

  public findAllPokemons(): void {
    this._loading = true;
    this.http.get<PokemonResponse>(apiPokemon + "?limit=" + POKEMON_PAGE_LIMIT)
    .subscribe({
      next: (response: PokemonResponse) => {
        this._pokemons = response.results.map(
          pokemon =>  {
            return  {
              ...pokemon,
              image: this.parseImageUrl(pokemon.url),
              id: this.parseId(pokemon.url)
            }
          }
        );
      },
      error: (error: HttpErrorResponse) => { this._error = error.message },
      complete: () => { this._loading = false },
    });
  }

  public pokemonById(pokemonId: number): Pokemon | undefined {
    return this._pokemons.find((pokemon: Pokemon) => pokemon.id === pokemonId);
  }

  private parseImageUrl(url: string): string  {
    const id = Number (url.split("/").filter(Boolean).pop());
    return `${apiSprites}/${id}.png`;
  }

  private parseId(url: string): number {
    return Number(url.split("/").filter(Boolean).pop());
  }


}
