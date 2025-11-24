import FormMarkDown from "@/components/mark-down/form-mark-down";
import ListMarkDown from "@/components/mark-down/list-mark-down";

const MarkDownNotesPage = () => {
  return (
    <div className=" flex w-full flex-col gap-8 lg:flex-row lg:items-start">
      <div className="w-full lg:max-w-lg">
        <FormMarkDown />
      </div>
      <div className="w-full flex-1">
        <ListMarkDown />
      </div>
    </div>
  );
};

export default MarkDownNotesPage;
