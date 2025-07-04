import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomModal from "../Components/UI/CustomModal";
import CustomInput from "../Components/UI/CustomInput";
import CustomButton from "../Components/UI/CustomButton";

interface LineFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: {
    id?: number;
    name: string;
    description: string;
  }) => void;
  initialData?: {
    id?: number;
    name: string;
    description: string;
  };
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

const LineFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData = { name: "", description: "" },
}: LineFormModalProps) => {
  return (
    <CustomModal
      visible={visible}
      title={initialData.id ? "Edit Line" : "Add Line"}
      onClose={onClose}
      width={600}
    >
      <Formik
        key={initialData.id ?? "new"}
        initialValues={initialData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form className="edit-line-form">
            <CustomInput
              name="name"
              label="Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.name}
              error={errors.name}
              required
            />

            <CustomInput
              name="description"
              label="Description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.description}
              error={errors.description}
              required
            />

            <div className="edit-line-actions">
              <CustomButton
                text="Cancel"
                type="default"
                className="btn"
                onClick={onClose}
              />
              <CustomButton
                text="Save"
                htmlType="submit"
                className="submit-btn"
                type="primary"
              />
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default LineFormModal;
