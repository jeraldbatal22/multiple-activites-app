import FormPokemon from "@/components/pokemons/form-pokemon";
import ListPokemon from "@/components/pokemons/list-pokemon";

const PokemonReviewPage = () => {
  return (
    <div className=" flex w-full flex-col gap-8 lg:flex-row lg:items-start">
      <div className="w-full lg:max-w-lg">
        <FormPokemon />
      </div>
      <div className="w-full flex-1">
        <ListPokemon />
      </div>
    </div>
  );
};

export default PokemonReviewPage;
