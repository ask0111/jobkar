"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const TermsCondition = () => {
  const [termsConditionData, setTermsConditionData] = useState("");
  const getTermsData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/terms_condition`
    );
    const { data } = response || {};
    setTermsConditionData(data?.terms_condition?.description);
    return data;
  };

  useEffect(() => {
    getTermsData();
  }, []);
  return (
    <div className="privacy-policy">
      <div
        dangerouslySetInnerHTML={{
          __html: termsConditionData,
        }}
      />
    </div>
  );
};

export default TermsCondition;
