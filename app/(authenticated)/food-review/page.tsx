import FormFood from "@/components/food-review/form-food";
import ListFood from "@/components/food-review/list-food";

const FoodReviewPage = () => {
  return (
    <div className=" flex w-full flex-col gap-8 lg:flex-row lg:items-start">
      <div className="w-full lg:max-w-lg">
        <FormFood />
      </div>
      <div className="w-full flex-1">
        <ListFood />
      </div>
    </div>
  );
};

export default FoodReviewPage;
