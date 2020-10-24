const Thing = require('../models/Thing');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    const thing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/storage/images/${req.file.filename}`
    });
    thing.save()
       .then( () => res.status(201).json({ message: 'Post saved successfully!' }) )
       .catch( error => res.status(400).json({error}) )
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllStuff = (req, res) => {
    Thing.find()
         .then(things => res.status(200).json(things))
         .catch(error => res.status(400).json(error));
};

exports.modifyThing =  (req, res, next) => {
    const thing = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/storage/images/${req.file.filename}`
    } : { ...req.body };
    Thing.updateOne({_id: req.params.id}, thing).then(
    () => {
        res.status(201).json({
        message: 'Thing updated successfully!'
        });
    }
    ).catch(
    (error) => {
        res.status(400).json({
        error: error
        });
    }
    );
};

exports.deleteThing = (req,res,next) => {
    Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/storage/images/')[1];
      fs.unlink(`/storage/images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};



