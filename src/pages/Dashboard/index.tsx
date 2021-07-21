import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { useEffect } from "react";
import { useState } from "react";
export interface FoodInterface {
  id: number;
  name: string;
  description: string;
  price: string;
  avaiable: boolean;
  image: string;
}
function Dashboard() {
  const [foodState, setFoodState] = useState<FoodInterface[]>([]);
  const [editingFoodState, setEditingFoodState] = useState<FoodInterface>(
    {} as FoodInterface
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFoods() {
      const response = await api.get("/foods");
      setFoodState(response.data);
    }
    getFoods();
  }, []);

  async function handleAddFood(food: FoodInterface) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoodState([...foodState, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodInterface) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFoodState.id}`, {
        ...editingFoodState,
        ...food,
      });

      const foodsUpdated = foodState.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoodState(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foodState.filter((food) => food.id !== id);

    setFoodState(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodInterface) {
    setEditingFoodState(food);
    setEditModalOpen(true);
  }
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFoodState}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foodState &&
          foodState.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
