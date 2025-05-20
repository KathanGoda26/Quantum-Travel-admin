import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import "./managetours.css";

const ITEMS_PER_PAGE = 5;

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [newTour, setNewTour] = useState({
    title: "",
    country: "",
    address: "",
    distance: "",
    photo: "",
    desc: "",
    price: "",
    maxGroupSize: "",
    featured: false,
  });

  const [editingTourId, setEditingTourId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTours = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tours`);
      const data = await res.json();
      if (res.ok) setTours(data.data);
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const isValidTour = () => {
    const {
      title,
      country,
      address,
      distance,
      photo,
      desc,
      price,
      maxGroupSize,
    } = newTour;

    return (
      title &&
      country &&
      address &&
      photo &&
      desc &&
      distance > 0 &&
      price > 0 &&
      maxGroupSize > 0
    );
  };

  const handleSubmit = async () => {
    if (!isValidTour()) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const method = editingTourId ? "PUT" : "POST";

    try {
      const res = await fetch(
        editingTourId
          ? `${BASE_URL}/tours/${editingTourId}`
          : `${BASE_URL}/tours`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTour),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(
          result.message || result.error || "Failed to save tour"
        );
      }

      setNewTour({
        title: "",
        country: "",
        address: "",
        distance: 0,
        photo: "",
        desc: "",
        price: 0,
        maxGroupSize: 0,
        featured: false,
      });
      setEditingTourId(null);
      fetchTours();
    } catch (err) {
      console.error("Error submitting tour:", err);
      alert(`Error: ${err.message}`); 
    }
  };

  const handleEdit = (tour) => {
    setEditingTourId(tour._id);
    setNewTour({ ...tour });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/tours/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Delete failed");
      fetchTours();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Upload failed");

      setNewTour((prev) => ({ ...prev, photo: result.imageUrl }));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const paginatedTours = tours.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(tours.length / ITEMS_PER_PAGE);

  return (
    <div className="tours-container">
      <h2>Manage Tours</h2>

      {/* Tour Form */}
      <div className="tour-form">
        <input
          placeholder="Title"
          value={newTour.title}
          onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
        />
        <input
          placeholder="Country"
          value={newTour.country}
          onChange={(e) => setNewTour({ ...newTour, country: e.target.value })}
        />
        <input
          placeholder="Address"
          value={newTour.address}
          onChange={(e) => setNewTour({ ...newTour, address: e.target.value })}
        />
        <input
          type="number"
          placeholder="Distance (km)"
          value={newTour.distance}
          onChange={(e) =>
            setNewTour({ ...newTour, distance: Number(e.target.value) })
          }
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
        {newTour.photo && (
          <img
            src={newTour.photo}
            alt="Preview"
            style={{ width: 100, marginTop: 10 }}
          />
        )}
        <textarea
          placeholder="Description"
          value={newTour.desc}
          onChange={(e) => setNewTour({ ...newTour, desc: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price ($)"
          value={newTour.price}
          onChange={(e) =>
            setNewTour({ ...newTour, price: Number(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Max Group Size"
          value={newTour.maxGroupSize}
          onChange={(e) =>
            setNewTour({ ...newTour, maxGroupSize: Number(e.target.value) })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={newTour.featured}
            onChange={(e) =>
              setNewTour({ ...newTour, featured: e.target.checked })
            }
          />
          Featured Tour
        </label>
        <button onClick={handleSubmit}>
          {editingTourId ? "Update Tour" : "Create Tour"}
        </button>
      </div>

      {/* Tour Table */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Country</th>
            <th>Address</th>
            <th>Price</th>
            <th>Distance</th>
            <th>Group</th>
            <th>Featured</th>
            <th>Reviews</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTours.map((tour) => (
            <tr key={tour._id}>
              <td>{tour.title}</td>
              <td>{tour.country}</td>
              <td>{tour.address}</td>
              <td>${tour.price}</td>
              <td>{tour.distance} km</td>
              <td>{tour.maxGroupSize}</td>
              <td>{tour.featured ? "Yes" : "No"}</td>
              <td>
                {tour.reviews && tour.reviews.length > 0 ? (
                  <ul>
                    {tour.reviews.map((review, index) =>
                      typeof review === "object" ? (
                        <li key={index}>
                          <strong>{review.username || "User"}:</strong>{" "}
                          {review.reviewText || "No text"} ({review.rating || 0}
                          /5)
                        </li>
                      ) : (
                        <li key={index}>{review}</li> // fallback for ObjectId strings
                      )
                    )}
                  </ul>
                ) : (
                  <em>No reviews</em>
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(tour)}>Edit</button>
                <button onClick={() => handleDelete(tour._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageTours;