import { connectToDB } from "@utils/database";
import User from "@models/user";
import Prompt from "@models/prompt";

export const POST = async (req) => {
  const { searchText } = await req.json();

  try {
    await connectToDB();

    const prompts = await Prompt.find({
      $or: [
        { tag: { $regex: searchText, $options: "i" } },
        { prompt: { $regex: searchText, $options: "i" } },
      ],
    }).populate("creator");

    const userIds = await User.find({
      username: { $regex: searchText, $options: "i" },
    }).distinct("_id");

    const documentsCreatedByUser = await Prompt.find({
      creator: { $in: userIds },
    }).populate("creator");

    const newPrompts = mergeArraysAndRemoveDuplicates(
      [...prompts],
      [...documentsCreatedByUser]
    );

    return new Response(JSON.stringify(newPrompts), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch all prompt", { status: 500 });
  }
};

function mergeArraysAndRemoveDuplicates(arr1, arr2) {
  const mergedMap = new Map();

  // Process the first array and add to the map
  for (const obj of arr1) {
    const key = JSON.stringify(obj); // Convert object to a string for comparison
    mergedMap.set(key, obj);
  }

  // Process the second array and add to the map
  for (const obj of arr2) {
    const key = JSON.stringify(obj);
    mergedMap.set(key, obj);
  }

  // Convert the map values back to an array
  const mergedArray = Array.from(mergedMap.values());

  return mergedArray;
}
