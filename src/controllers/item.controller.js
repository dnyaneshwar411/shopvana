import { Category } from '../models/category.model.js';
import { Item } from './../models/item.model.js';

export async function readAll(req, res) {
  try {
    const categories = await Item.find().populate({path: "category", select: "-_id name"}).populate({path: "createdBy", select: "-_id name email username"});
    return res.status(200).json({payload: categories});
  } catch (error) {
    res.status(500).json({ payload: error.message })
  }
}

export async function create(req, res) {
  try {
    const { name, description, category, price, availableQuantity } = req.body;
    const exists = await Item.findOne({ name: name });

    const categoryExists = await Category.findOne({ _id: category});
    if(!categoryExists) return res.status(404).json({ payload: "No such category exists kindly choose another one!" });

    const item = new Item({ name, description, price, availableQuantity, category, createdBy: req.user._id });
    await item.save();

    const categoryItem = await Category.findOneAndUpdate({ _id: category },
    { $push: { items: item._id } },
    { new: true });
    await categoryItem.save();
    return res.status(200).json({ payload: "Item added successfully!" });
  } catch (error) {
    res.status(500).json({ payload: error.message })
  }
}

export async function read(req, res) {
  try {
    const { itemId: _id } = req.params
    const categories = await Item.findOne({ _id }).populate({path: "category", select: "-_id name"}).populate({path: "createdBy", select: "-_id name email username"});
    return res.status(200).json({payload: categories});
  } catch (error) {
    res.status(500).json({ payload: error.message })
  }
}

export async function update(req, res) {
  try {
    const { _id } = req.body;
    const item = await Item.findOne({ _id });

    if(!item) return res.status(404).json({ payload: "Requested Item not found!" });
    if(!item.createdBy.equals(req.user._id)) return res.status(404).json({ payload: "You are not authorized to edit this item!"});

    Object.assign(item, req.body);
    await item.save();
    
    return res.status(200).json({ payload: `Item updated successfully with requested changes`, item});

  } catch (error) {
    res.status(500).json({ payload: error.message })
  }
}

export async function del(req, res) {
  try {
    const { _id } = req.body;
    const item = await Item.findOneAndDelete({ _id });
    console.log(item)
    await Category.findOneAndUpdate({ _id: item.category },
    { $pull: { items: item._id } },
    { new: true });
    return res.status(200).json({ payload: `Item deleted successfully!`})
  } catch (error) {
    res.status(500).json({ payload: error.message })
  }
}