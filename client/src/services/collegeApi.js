

export const searchColleges = async (filters) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/collegesexplore/ai-search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return {
      success: true,
      colleges: data.colleges || [],
    };
  } catch (error) {
    console.error("❌ College search failed:", error);
    return {
      success: false,
      colleges: [],
      error: error.message,
    };
  }
};
