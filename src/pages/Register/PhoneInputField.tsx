import "react-phone-input-2/lib/high-res.css";
import PhoneInput from "react-phone-input-2";
import React from "react";

interface PhoneInputFieldProps {
  postPhoneNumber: () => void;
  formData: {
    phone_number: string;
    country_code: string;
    country: string;
    country_full_name: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      phone_number: string;
      country_code: string;
      country: string;
      country_full_name: string;
    }>
  >;
}

export default function PhoneInputField({
  postPhoneNumber,
  formData,
  setFormData,
}: PhoneInputFieldProps) {
  return (
    <div>
      <div className="w-full rounded-xl bg-gray-50 text-black">
        <PhoneInput
          placeholder="Enter phone number"
          value={formData.phone_number}
          onEnterKeyPress={postPhoneNumber}
          onChange={(value, data: any) => {
            setFormData((prevData) => ({
              ...prevData,
              country_code: `+${data.dialCode}`,
              phone_number: `+${value}`,
              country: data.countryCode,
              country_full_name: data.name,
            }));
          }}
          country="us"
          enableSearch
        />
      </div>
    </div>
  );
}

// import "react-phone-input-2/lib/high-res.css";
// import PhoneInput from "react-phone-input-2";

// export default function PhoneInputField({
//   postPhoneNumbe,
//   formData,
//   setFormData,
// }) {
//   return (
//     <div>
//       <div className="w-full rounded-xl bg-gray-50 text-black">
//         <PhoneInput
//           placeholder="Enter phone number"
//           value={formData.phone_number}
//           onEnterKeyPress={postPhoneNumber}
//           onChange={(value, data) => {
//             setFormData((prevData) => ({
//               ...prevData, // Keep existing formData properties
//               country_code: `+${data.dialCode}`,
//               phone_number: `+${value}`,
//               country: data.countryCode,
//               country_full_name: data.name,
//             }));
//           }}
//           country={"us"}
//           enableSearch
//         />
//       </div>
//     </div>
//   );
// }

