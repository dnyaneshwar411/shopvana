import { Category } from './../models/category.model.js';

export async function readAll(req, res) {
  try {
    const categories = await Category.find();
    return res.status(200).json({payload: categories});
  } catch (error) {
    res.status(500).json({ payload: error.message })
  }
}

export async function create(req, res) {
  try {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name: name });

    if(exists) return res.status(404).json({payload: `Category already with name ${name} already exists`});

    const category = new Category({ name, description, createdBy: req.user._id });
    await category.save();

    return res.status(200).json({ payload: `category created successfully with name - ${name}`})
  } catch (error) {
    res.status(500).json({ payload: error.message })
  }
}

export async function read(req, res) {
  try {
    const { categoryId: _id } = req.params;
    const category = await Category.findOne({_id}).populate({path: 'createdBy', select: '-_id name email username'});
    if(!category) throw new Error("Requested category not found!");
    return res.status(200).json({payload: category});
  } catch (error) {
    res.status(500).json({ payload: error.message });
  }
}

export async function update(req, res) {
  try {
    const { _id } = req.body;
    const category = await Category.findOne({ _id });

    if(!category) return res.status(404).json({ payload: "Requested category not found!" });
    if(!category.createdBy.equals(req.user._id)) return res.status(404).json({ payload: "You are not authorized to edit this category!"});

    Object.assign(category, req.body);
    await category.save();
    
    return res.status(200).json({ payload: `Category updated successfully with requested changes`, category});
  } catch (error) {
    res.status(500).json({ payload: error.message });
  }
}

export async function del(req, res) {
  try {
    const { _id } = req.body;
    const category = await Category.findOneAndDelete({ _id });
    const name = category.name;
    return res.status(200).json({ payload: `Category deleted successfully with name ${name}`})
  } catch (error) {
    return res.status(500).json({ payload: error.message })
  }
}