import FormTodo from "@/components/todo/form-todo";
import ListTodo from "@/components/todo/list-todo";

const TodoPage = () => {
  return (
    <div className=" flex w-full flex-col gap-8 lg:flex-row lg:items-start">
      <div className="w-full lg:max-w-lg">
        <FormTodo />
      </div>
      <div className="w-full flex-1">
        <ListTodo />
      </div>
    </div>
  );
};

export default TodoPage;
