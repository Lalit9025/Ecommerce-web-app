import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  //get cat
  const getCategories = async () => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/category/get-category`);
      setCategories(data?.category);
      console.log(categories)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}