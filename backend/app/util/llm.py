from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv
load_dotenv()

llm = ChatGoogleGenerativeAI(model="models/gemini-1.5-flash-8b", google_api_key=os.getenv("GOOGLE_API_KEY"))
prompt = PromptTemplate.from_template("Give 7-10 comma-separated tags for the article title: {title}")
chain = LLMChain(llm=llm, prompt=prompt)

async def generate_tags(title: str) -> str:
    return chain.invoke(title)
