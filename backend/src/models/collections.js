const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collections', {
    collectionId: {
      field: 'collection_id',
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "slug"
    },
    tagline: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    season: {
      type: DataTypes.ENUM('Spring/Summer', 'Fall/Winter', 'Resort', 'Pre-Fall', 'Special Edition'),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heroImageUrl: {
      field: 'hero_image_url',
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coverImageUrl: {
      field: 'cover_image_url',
      type: DataTypes.STRING(255),
      allowNull: true
    },
    footerImageUrl: {
      field: 'footer_image_url',
      type: DataTypes.STRING(255),
      allowNull: true
    },
    editorialContent: {
      field: 'editorial_content',
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Stores the sequence of story blocks (text, image, products)'
    },
    isFeatured: {
      field: 'is_featured',
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    isActive: {
      field: 'is_active',
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'collections',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "collection_id" },
        ]
      },
      {
        name: "slug",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
};
