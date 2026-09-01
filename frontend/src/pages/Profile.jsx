import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
 const { token, login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Unable to load profile"
          );
          return;
        }

        const user = data.user;

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          address: {
            street: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            pincode: user.address?.pincode || "",
          },
        });
      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );

        alert("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["street", "city", "state", "pincode"].includes(
        name
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update profile"
        );
        return;
      }

      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
        address: {
          street:
            data.user.address?.street || "",
          city:
            data.user.address?.city || "",
          state:
            data.user.address?.state || "",
          pincode:
            data.user.address?.pincode || "",
        },
      });
login(data.user, token);
      alert(
        "Profile and address updated successfully ✅"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      alert(
        "Something went wrong while updating profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "50px" }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>My Profile 👤</h1>
<form
  onSubmit={handleSubmit}
  className="profile-form"
>
        <div className="profile-field">
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

      <div className="profile-field">
          <label>Phone</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <h2>Shipping Address 📍</h2>

       <div className="profile-field">
          <label>Street</label>

          <input
            type="text"
            name="street"
            value={formData.address.street}
            onChange={handleChange}
          />
        </div>

       <div className="profile-field">
          <label>City</label>

          <input
            type="text"
            name="city"
            value={formData.address.city}
            onChange={handleChange}
          />
        </div>

       <div className="profile-field">
          <label>State</label>

          <input
            type="text"
            name="state"
            value={formData.address.state}
            onChange={handleChange}
          />
        </div>

       <div className="profile-field">
          <label>Pincode</label>

          <input
            type="text"
            name="pincode"
            value={formData.address.pincode}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="profile-save-btn"
        >
          {saving
            ? "Saving..."
            : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;