import Phone from "../models/phoneModel.js";

const getPhone = async (req, res) => {
  try {
    const phones = await Phone.find({});

    res.json({
      message: "Phone data fetched successfully",
      success: true,
      count: phones.length,
      data: phones,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch phone data",
      success: false,
      error: error.message,
    });
  }
};


export { getPhone };
