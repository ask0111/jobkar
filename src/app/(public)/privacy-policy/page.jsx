"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import SectionContainer from "../../components/SectionContainer";

const Privacypolicy = () => {
  const [privacyData, setPrivacyData] = useState("");
  const getPrivacyData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/privacy_policy`
    );
    const { data } = response || {};
    setPrivacyData(data?.privacy_policy?.description);
    return data;
  };
  console.log(privacyData);

  useEffect(() => {
    getPrivacyData();
  }, []);
  return (
    <SectionContainer className="privacy-policy">
      <div
        dangerouslySetInnerHTML={{
          __html: privacyData,
        }}
      />
    </SectionContainer>
  );
};

export default Privacypolicy;
