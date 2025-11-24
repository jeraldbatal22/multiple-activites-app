import FormGoogleDrive from "@/components/google-drive/form-google-drive";
import ListGoogleDrive from "@/components/google-drive/list-google-drive";

const GoogleDrivePage = () => {
  return (
    <div className=" flex w-full flex-col gap-8 lg:flex-row lg:items-start">
      <div className="w-full lg:max-w-lg">
        <FormGoogleDrive />
      </div>
      <div className="w-full flex-1">
        <ListGoogleDrive />
      </div>
    </div>
  );
};

export default GoogleDrivePage;
