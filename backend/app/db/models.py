from sqlalchemy import Column, Integer, String, Text, ForeignKey,Table
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()
article_saves = Table(
    "article_saves",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("article_id", Integer, ForeignKey("articles.id"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    saved_articles = relationship("Article", secondary=article_saves, back_populates="saved_by_users")

class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, index=True, nullable=False)  # External page ID if needed
    title = Column(String, nullable=False)
    snippet = Column(Text, nullable=False)
    tags = Column(String)  # comma-separated
    body = Column(Text, nullable=False)

    saved_by_users = relationship("User", secondary=article_saves, back_populates="saved_articles")


