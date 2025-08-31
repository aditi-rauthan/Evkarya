import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs from 'dayjs';

export default function Calendar() {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const vendorId = localStorage.getItem('vendorId');  // Get the vendor ID from localStorage or session

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    // Fetch Vendor Profile with Posts and Services
    axios
      .get(`http://localhost:5002/api/vendors/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const vendor = response.data.vendor;
        const posts = response.data.posts;

        // Make sure we are getting the correct unavailability data
        console.log("Vendor:", vendor);
        console.log("Posts:", posts);

        // Combine unavailability from vendor profile and posts
        const vendorUnavailableDates = vendor.notAvailableDates || [];
        const postUnavailableDates = posts
          .filter(post => post.availability === false && post.unavailableUntil)
          .map(post => dayjs(post.unavailableUntil).format('YYYY-MM-DD'));

        // Merge dates, remove duplicates
        const allUnavailableDates = [...new Set([...vendorUnavailableDates, ...postUnavailableDates])];
        setUnavailableDates(allUnavailableDates);
      })
      .catch((error) => {
        console.error("Error fetching vendor data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [vendorId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Combine all unavailable dates
  const disabledDates = unavailableDates;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateTimePicker
        orientation="landscape"
        renderInput={(props) => <input {...props} />}
        shouldDisableDate={(date) => {
          const formattedDate = date.format('YYYY-MM-DD');
          return disabledDates.includes(formattedDate);  // Check if date is in unavailable dates
        }}
      />
    </LocalizationProvider>
  );
}
