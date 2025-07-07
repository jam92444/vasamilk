import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomModal from "../Components/UI/CustomModal";
import CustomInput from "../Components/UI/CustomInput";
import CustomButton from "../Components/UI/CustomButton";
import "../Styles/pages/_pricetag.scss";

export interface PriceTagFormValues {
  id?: number;
  name: string;
  price: number | string;
}

interface PriceTagFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: PriceTagFormValues) => void;
  initialData?: PriceTagFormValues;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price must be greater than or equal to 0"),
});

const PriceTagFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData = { name: "", price: "" },
}: PriceTagFormModalProps) => {
  return (
    <CustomModal
      visible={visible}
      title={initialData?.id ? "Edit Price Tag" : "Add Price Tag"}
      onClose={onClose}
      width={600}
    >
      <Formik
        initialValues={initialData}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
      >
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <Form className="price-tag-form">
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
              name="price"
              label="Price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.price}
              error={errors.price}
              required
            />

            <div className="form-actions">
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
              />
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default PriceTagFormModal;
