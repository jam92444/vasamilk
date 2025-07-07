import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomModal from "../Components/UI/CustomModal";
import CustomInput from "../Components/UI/CustomInput";
import CustomButton from "../Components/UI/CustomButton";

export interface ReasonFormValues {
  id?: number;
  name: string;
  status?: number;
}

interface ReasonFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: ReasonFormValues) => void;
  initialData?: ReasonFormValues;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

const ReasonFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData = { name: "" },
}: ReasonFormModalProps) => {
  return (
    <CustomModal
      visible={visible}
      title={initialData?.id ? "Edit Reason" : "Add Reason"}
      onClose={onClose}
      width={500}
    >
      <Formik
        initialValues={initialData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          onSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <div className="reason">
            <Form className="reason-form">
              <CustomInput
                name="name"
                label="Reason Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.name}
                error={errors.name}
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
          </div>
        )}
      </Formik>
    </CustomModal>
  );
};

export default ReasonFormModal;
