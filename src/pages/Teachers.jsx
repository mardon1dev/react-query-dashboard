import React, { useEffect, useState } from "react";
import TableDisplay from "../components/Table/Table";
import Loading from "../components/Loaging/Loading";
import ModalWrapper from "../components/Modal/Modal";
import { Input, Select } from "antd";
import NoData from "../components/Empty/Empty";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { URL } from "../hook/useEnv";

const Teachers = () => {
  const queryCLient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    age: "",
    email: "",
    address: "",
    subjects,
    isTeacher: true,
  });

  // SHow all teachers

  async function fetchTeachers() {
    // setLoading(false);
    try {
      const response = await axios.get(`${URL}/teachers`);
      const allTeachers = response.data.map((teacher, index) => {
        teacher.key = index + 1;
        return teacher;
      });
      return allTeachers;
    } catch (error) {
      console.error(error);
    }
  }

  const { data = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const addTeacher = async (newTeacher) => {
    try {
      const response = await axios.post(`${URL}/teachers`, newTeacher);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const mutation = useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      queryCLient.invalidateQueries("teachers");
      setRefreshPage(!refreshPage);
      setShowModal(false);
      setNewTeacher({
        name: "",
        age: "",
        email: "",
        address: "",
        subjects: [],
        isTeacher: true,
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await mutation.mutateAsync(newTeacher);
    setTimeout(() => {
      setLoading(false);  
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setShowModal(false);
    setSubjects([]);
    setNewTeacher({ name: "", age: "", email: "", address: "", subjects: [] });
  };

  // Choose courses
  const options = [
    { value: "Maths", label: "Maths" },
    { value: "Science", label: "Science" },
    { value: "English", label: "English" },
    { value: "History", label: "History" },
    { value: "Geography", label: "Geography" },
    { value: "Biology", label: "Biology" },
  ];

  const handleChange = (value) => {
    setNewTeacher((prevState) => ({
      ...prevState,
      subjects: value,
    }));
  };

  // Update user functions

  console.log(loading);

  return (
    <div className="w-full">
      <div className="w-full flex justify-between my-5">
        <h1 className="text-sxl font-semibold">Teachers list</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#000]/20 px-4 rounded py-1 font-semibold active:bg-[#000]/30"
        >
          Add Teacher
        </button>
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : data.length > 0 ? (
          <TableDisplay
            data={data}
            refreshPage={refreshPage}
            setRefreshPage={setRefreshPage}
          />
        ) : (
          <div className="w-full text-center">
            <NoData />
          </div>
        )}
      </div>
      <ModalWrapper
        open={showModal}
        setOpen={setShowModal}
        title={"Add Teacher"}
        handleCancel={handleCancel}
      >
        <div>
          <form onSubmit={handleSubmit} className="p-2" autoComplete="off">
            <div className="mt-2">
              <label>Teacher Name:</label>
              <Input
                className="mt-2"
                allowClear
                type="text"
                name="name"
                value={newTeacher.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <label>Teacher Age:</label>
              <Input
                className="mt-2"
                allowClear
                type="number"
                name="age"
                value={newTeacher.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <label>Teacher Email:</label>
              <Input
                className="mt-2"
                allowClear
                type="email"
                name="email"
                value={newTeacher.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <label>Teacher Address:</label>
              <Input
                className="mt-2"
                allowClear
                type="text"
                name="address"
                value={newTeacher.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <label>Choose subject:</label>
              <Select
                className="mt-2 w-full"
                mode="tags"
                placeholder="Choose course"
                value={newTeacher.subjects}
                onChange={handleChange}
                options={options}
              />
            </div>
            <div className="w-full flex items-center justify-end space-x-5 mt-5">
              <button
                type="button"
                className="text-[16px]"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#000]/20 active:bg-[#000]/30 px-2 rounded text-[16px]"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default Teachers;
