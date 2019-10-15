import setuptools

with open("modelzoo/README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="modelzoo",
    version="0.3.2",
    author="Rehan Durrani",
    author_email="rdurrani@berkeley.edu",
    description="Python package for querying ModelZoo.Live",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/harbor-ml/modelzoo",
    packages=setuptools.find_packages(),
    classifiers=[
        "Development Status :: 1 - Planning",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python :: 3 :: Only",
    ],
    python_requires='>=3.6',
)
