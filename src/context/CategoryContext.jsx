import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);

    const [categories, setCategories] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("categories")) || [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        if (!currentUser) return;

        setCategories((prev) => [...prev]);
    }, [currentUser]);

    const userCategories = categories.filter(
        (c) => c.userId === currentUser?.username
    );

    const addCategory = (name) => {
        if (!currentUser) return;

        const trimmed = name.trim();

        if (!trimmed) {
            alert("Category name cannot be empty");
            return;
        }

        const isDuplicate = categories.some(
            (c) => c.name.toLowerCase() === trimmed.toLowerCase() &&
                c.userId === currentUser.username
        );

        if (isDuplicate) {
            alert("This category already exists");
            return;
        }

        const newCategory = {
            id: Date.now(),
            name: trimmed,
            userId: currentUser.username,
        };

        setCategories([...categories, newCategory]);
    };

    const updateCategory = (id, newName) => {
        const trimmed = newName.trim();

        if (!trimmed) {
            alert("Category name cannot be empty");
            return;
        }

        const isDuplicate = categories.some(
            (c) =>
                c.name.toLowerCase() === trimmed.toLowerCase() &&
                c.userId === currentUser.username &&
                c.id !== id
        );

        if (isDuplicate) {
            alert("This category already exists");
            return;
        }

        const updated = categories.map((c) =>
            c.id === id ? { ...c, name: trimmed } : c
        );

        setCategories(updated);
    };


    const deleteCategory = (id) => {
        setCategories(categories.filter((c) => c.id !== id));
    };

    return (
        <CategoryContext.Provider
            value={{
                categories: userCategories,
                addCategory,
                deleteCategory,
                updateCategory,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};
