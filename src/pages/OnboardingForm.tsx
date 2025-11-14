import "./OnboardingForm.scss";
import Page from "../components/Page";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface OnboardingFormData {
  initialDate: Date;
  availableDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  prescriptionType: string;
  dosage: number;
}

function OnboardingForm() {
  const { handleSubmit, control } = useForm<OnboardingFormData>({
    defaultValues: {
      initialDate: new Date(),
      availableDays: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      prescriptionType: "",
      dosage: 1,
    },
  });

  const onSubmit = (data: OnboardingFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <Page title="Onboarding" className="OnboardingForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="initialDate">Initial Date</label>
        <Controller
          control={control}
          name="initialDate"
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
            />
          )}
        />

        <label>Days Available for Pickup (Select 2-7 days)</label>
        <div className="OnboardingForm__checkboxGroup">
          <label className="checkbox-day">
            <input type="checkbox" />
            <span>Monday</span>
          </label>
          <label className="checkbox-day">
            <input type="checkbox" />
            <span>Tuesday</span>
          </label>
          <label className="checkbox-day">
            <input type="checkbox" />
            <span>Wednesday</span>
          </label>
          <label className="checkbox-day">
            <input type="checkbox" />
            <span>Thursday</span>
          </label>
          <label className="checkbox-day">
            <input type="checkbox" />
            <span>Friday</span>
          </label>
          <label className="checkbox-day">
            <input type="checkbox" />
            <span>Saturday</span>
          </label>
          <label className="checkbox-day">
            <input type="checkbox" />
            <span>Sunday</span>
          </label>
        </div>

        <label htmlFor="prescriptionType">Type of Prescription</label>
        <select id="prescriptionType">
          <option value="">Select prescription type</option>
          <option value="reducing">Reducing</option>
          <option value="increasing">Increasing</option>
          <option value="stabilising">Stabilising</option>
        </select>

        <label htmlFor="dosage">Dosage (mg)</label>
        <input type="number" id="dosage" min="1" max="60" />

        <button type="submit">Submit Onboarding</button>
      </form>
    </Page>
  );
}

export default OnboardingForm;
